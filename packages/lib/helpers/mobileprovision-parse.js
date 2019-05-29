const moment = require('moment');
const fs = require('fs-extra')
const path = require('path')
const plist = require('plist')
const {
  filterAsync
} = require('node-filter-async')
const {
  to,
  execXcodeBuild,
  showFigletTitle,
  filterFileByExt,
  asyncForEach,
  chalk
} = require('../../shared-utils/index.js')

module.exports = class MobileprovisionParse {
  constructor(scope) {
    this.mplist = []
    //缓存解析出来的 Mobileprovision对象
    this.mbOjb = {}
    this.bitcode = scope.bitcode || false
    this.bundleId = scope.bundleId || ''
    this.ipaOutPath = scope.ipa.output || process.cwd()
  }

  async parseObj() {
    let retList = await this.loadMobileprovisionFile();
    await asyncForEach(retList, async (item) => {
      let retItem = await this.parseCerObj(item);
      this.mplist.push(retItem)
    })
  }

  async parseCerObj(item) {
    let DeveloperCertificates = item.DeveloperCertificates;
    fs.ensureDirSync(this.cerPath)
    await fs.writeFile(path.resolve(this.cerPath, 'tmp.cer'), `-----BEGIN CERTIFICATE-----\n${DeveloperCertificates[0].toString('base64')}\n-----END CERTIFICATE-----`)
    /**
     * 然后执行
     * openssl x509 -noout -text -in "$cerFile"  | grep Subject | grep "CN=" | cut -d "," -f2 | cut -d "=" -f2
     *  */
    let qm = `echo $(openssl x509 -noout -text -in "${path.resolve(this.cerPath, 'tmp.cer')}")`
    let regUri = /Serial Number:\s*(?<serialNumber>[\w,\W,\s]*)Signature[\w,\W,\s]*Not Before:\s*(?<createTime>[\w,\W,\s]*)GMT Not After :\s*(?<expireTime>[\w,\W,\s]*)GMT Subject:[\w,\W,\s]*CN=(?<codeSignIdentity>[\w,\W,\s]*), OU=/
    let qobj = await execXcodeBuild(qm)
    let mObj = qobj.match(regUri);
    await fs.remove(this.cerPath)
    if (mObj && mObj.groups) {
      let expireTime = moment(mObj.groups.expireTime, 'MMMM DD hh:mm:ss YYYY')
      let expireDay = moment.duration(expireTime.diff(moment())).asDays();
      return Object.assign(item, {
        signObj: {
          expireTime: mObj.groups.expireTime,
          createTime: mObj.groups.createTime,
          codeSignIdentity: mObj.groups.codeSignIdentity,
        },
        expireDay
      })
    } else {
      return item
    }

  }

  async parseCerObjByFileName(fileName) {
    let fobj = await this.loadMobileprovisionFileName(fileName)
    this.mbOjb = await this.parseCerObj(fobj)
    await this.logObj()
  }

  get cerPath() {
    return path.resolve(this.ipaOutPath, 'tmpcer')
  }

  async getProfileType(obj) {
    const {
      Entitlements,
      ProvisionedDevices,
      ProvisionsAllDevices,
    } = obj;
    let objType = 'ad-hoc'
    if (ProvisionedDevices && Entitlements['get-task-allow']) {
      /** 
       * 'com.apple.developer.associated-domains': '*',
       'aps-environment': 'development' },
       * */
      if (Entitlements['aps-environment']) {
        objType = 'development'
      } else {
        objType = 'personal'
      }
    } else {
      if (ProvisionsAllDevices) {
        objType = 'enterprise'
      } else {
        objType = 'app-store'
      }
    }
    return objType
  }

  async loadMobileprovisionFile(filePath) {
    let retList = []
    if (filePath) {
      let efp = await fs.pathExists(filePath)
      if (efp) {
        let filters = await filterFileByExt('*.mobileprovision', efp)
        await asyncForEach(filters, async (file) => {
          let ret = await this.execSecurity(file)
          retList.push(plist.parse(ret))
        });
        return retList;
      }
    }
    let filters = await filterFileByExt('*.mobileprovision', `${require('os').homedir()}/Library/MobileDevice/Provisioning Profiles/`)
    await asyncForEach(filters, async (file) => {
      let ret = await this.execSecurity(file)
      retList.push(plist.parse(ret))
    });
    return retList;
  }

  async parseMobileProvisionObj(bundleId, method) {
    await this.parseObj()
    let blist = this.mplist.filter(e => {
      return e.Entitlements['application-identifier'] === `${e.Entitlements['com.apple.developer.team-identifier']}.${bundleId}`
    })
    if (blist && blist.length > 0) {
      if (method) {
        let mlist = await filterAsync(blist, async (e) => {
          let m = await this.getProfileType(e)
          return method === m
        })
        mlist = mlist.sort((e1, e2) => e2.expireDay - e1.expireDay)
        if (mlist && mlist.length > 0) {
          this.mbOjb = mlist[0]
        }
      } else {
        this.mbOjb = blist.sort((e1, e2) => e2.expireDay - e1.expireDay)[0]
      }
    }
  }

  async getExportOptionsPlist() {
    const {
      Name,
      Entitlements,
    } = this.mbOjb;
    let method = await this.getMethod(this.mbOjb);
    let objTmp = {
      compileBitcode: this.bitcode,
      destination: 'export',
      method: method,
      provisioningProfiles: {
        [this.bundleId]: Name //需要修改bundleId
      },
      signingStyle: 'manual',
      stripSwiftSymbols: true,
      teamID: Entitlements['com.apple.developer.team-identifier'], //需要修改teamID
      thinning: '<none>'
    }
    let rplist = plist.build(objTmp)
    return rplist
  }


  async getMethod(obj = this.mbOjb) {
    return await this.getProfileType(obj)
  }

  getXcconfig() {
    const {
      Name,
      UUID,
      Entitlements,
      signObj
    } = this.mbOjb;
    let bc = this.bitcode ? 'YES' : 'NO'
    const N = "\n";
    let xcconfigStr = `${N}ENABLE_BITCODE = ${bc}${N}DEBUG_INFORMATION_FORMAT = dwarf${N}CODE_SIGN_STYLE = Manual${N}ARCHS = arm64${N}PROVISIONING_PROFILE_SPECIFIER = ${Name}${N}PROVISIONING_PROFILE = ${UUID}${N}DEVELOPMENT_TEAM = ${Entitlements['com.apple.developer.team-identifier']}${N}CODE_SIGN_IDENTITY = ${signObj.codeSignIdentity}${N}PRODUCT_BUNDLE_IDENTIFIER = ${this.bundleId}`
    return xcconfigStr
  }

  async logObj() {
    showFigletTitle()
    const {
      UUID,
      Entitlements,
      CreationDate, //创建时间：
      ExpirationDate, //过期时间
      signObj
    } = this.mbOjb;
    let profileType = await this.getProfileType(this.mbOjb);
    let expireTime = moment(signObj.expireTime, 'MMMM DD hh:mm:ss YYYY')
    let createTime = moment(signObj.createTime, 'MMMM DD hh:mm:ss YYYY')
    let lastDay = moment.duration(expireTime.diff(moment())).asDays();
    console.log(`👉 CODE_SIGN_IDENTITY: ${chalk.blue(signObj.codeSignIdentity)}`);
    console.log(`👉 BundleID: ${chalk.blue(Entitlements['application-identifier'])}`);
    console.log(`👉 UUID: ${chalk.blue(UUID)}`);
    console.log(`👉 授权文件 创建时间:', ${chalk.blue(moment(CreationDate).format('YYYY年MM月DD日'))}`)
    console.log(`👉 授权文件 过期时间:', ${chalk.blue(moment(ExpirationDate).format('YYYY年MM月DD日'))}`)
    console.log(`👉 证书创建时间: ${chalk.blue(moment(createTime).format('YYYY年MM月DD日'))}`);
    console.log(`👉 证书过期时间: ${chalk.blue(moment(expireTime).format('YYYY年MM月DD日'))}`);
    console.log(`👉 授权文件有效天数: ${chalk.blue(Math.floor(lastDay))}天`);
    console.log(`👉 证书类型为: ${chalk.blue(profileType)}`);
  }

  async execSecurity(file) {
    let ret = await execXcodeBuild(`/usr/bin/security cms -D -i "${file}"`);
    return ret;
  }

  async loadMobileprovisionFileName(fileName) {
    let ret = await this.execSecurity(fileName)
    return plist.parse(ret);
  }
}
