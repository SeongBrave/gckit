const fs = require('fs-extra')
const path = require('path')
const homedir = require('os').homedir()
const {
  datalist
} = require('./datalist.js')

/**
 * 加载文件，包括配置文件和模板文件
 *加载约定: 输入参数>项目配置>用户配置>gckitconfig
 *
 * @param {string} [file='.gckitconfig']
 * @returns
 */
exports.loadConf = async () => {
  let file = '.gckitconfig'
  let langList = datalist.langList
  const rFile = path.resolve(__dirname, '../../../gckit-templates', `config/${file}`)
  let rc = await fs.readJson(rFile);
  const hFile = path.resolve(homedir, '.gckit', file)
  if (fs.existsSync(hFile)) {
    let hc = await fs.readJson(hFile);
    Object.assign(rc, hc)
  }
  const pFile = path.resolve(process.cwd(), '.gckit', file)
  if (fs.existsSync(pFile)) {
    let pc = await fs.readJson(pFile);
    let ps = pc.cGTypes
    let rs = rc.cGTypes
    if (ps && rs) {
      for (const ri of rs) {
        if (!ps.find((si) => si.gType === ri.gType)) {
          ps.push(ri)
        }
      }
    } else if (rs) {
      ps = rs
    }
    pc.cGTypes = ps || []
    let pl = pc.cLangList
    let rl = rc.cLangList
    if (pl && rl) {
      for (const ri of rl) {
        if (!pl.find((si) => si.lang === ri.lang)) {
          pl.push(ri)
        }
      }
    } else if (rl) {
      pl = rl
    }
    pc.cLangList = pl || []

    Object.assign(rc, pc)
  }
  let rGTypes = rc.cGTypes
  if (rGTypes) {
    for (const {
        gType,
        ...options
      } of rGTypes) {
      rc[gType] = options
    }
  }
  let cLangList = rc.cLangList
  if (cLangList) {
    for (const cl of cLangList) {
      if (!langList.find((li) => li.lang === cl.lang)) {
        langList.push(cl)
      }
    }
  }
  rc.langList = langList
  return rc
}

/**
 * 加载文件，包括配置文件和模板文件
 *加载约定: 输入参数>项目配置>用户配置>gckitconfig
 *
 * @param {string} [file='.gckitconfig']
 * @returns
 */
exports.loadFile = async (file = '.gckitconfig') => {
  let isConfig = file == '.gckitconfig'
  const pFile = path.resolve(process.cwd(), '.gckit', isConfig ? file : `templates/${file}`)
  if (fs.existsSync(pFile)) {
    let pc = await fs.readFile(pFile, 'utf8');
    return pc
  }
  const hFile = path.resolve(homedir, '.gckit', isConfig ? file : `templates/${file}`)
  if (fs.existsSync(hFile)) {
    let hc = await fs.readFile(hFile, 'utf8');
    return hc;
  }
  const rFile = path.resolve(__dirname, '../../../gckit-templates', isConfig ? `config/${file}` : `templates/${file}`)
  const erc = await fs.pathExists(rFile)
  if (erc) {
    let rc = await fs.readFile(rFile, 'utf8');
    return rc;
  }
  return '';
}

/**
 * 在配置生成文件类型的时候 需要读取已经配置的自定义的类型，除非是正在配置自定义类型
 *加载约定: 如果正在配置项目配置则首先读取用户维度的配置，然后再读取项目维度的自定义类型配置，然后再合并配置，项目维度的会覆盖用户维度
 *
 * @param {bool} [isPorject] 表示是否是项目配置
 * @returns
 */
exports.loadCGTypes = async (isPorject = false) => {
  let file = '.gckitconfig'
  let cGTypes = []
  const hFile = path.resolve(homedir, '.gckit', file)
  if (fs.existsSync(hFile)) {
    let hc = await fs.readJson(hFile);
    if (hc && hc.cGTypes) {
      cGTypes = hc.cGTypes
    }
  }
  if (isPorject) {
    const pFile = path.resolve(process.cwd(), '.gckit', file)
    if (fs.existsSync(pFile)) {
      let pc = await fs.readJson(pFile);
      let ps = pc.cGTypes
      if (pc && ps) {
        for (const ri of cGTypes) {
          if (!ps.find((si) => si.gType === ri.gType)) {
            ps.push(ri)
          }
        }
        cGTypes = ps
      }
    }
  }
  return cGTypes
}

/**
 * 同loadCGTypes 一样,在配置自定义语言的时候，需要读取已经配置的自定义的语言，除非是正在配置自定义语言
 *加载约定: 如果正在配置项目配置则首先读取用户维度的配置，然后再读取项目维度的自定义类型配置，然后再合并配置，项目维度的会覆盖用户维度
 *
 * @param {bool} [isPorject] 表示是否是项目配置
 * @returns
 */
exports.loadCLangList = async (isPorject = false) => {
  let file = '.gckitconfig'
  let cLangList = []
  const hFile = path.resolve(homedir, '.gckit', file)
  if (fs.existsSync(hFile)) {
    let hc = await fs.readJson(hFile);
    if (hc && hc.cLangList) {
      cLangList = hc.cLangList
    }
  }
  if (isPorject) {
    const pFile = path.resolve(process.cwd(), '.gckit', file)
    if (fs.existsSync(pFile)) {
      let pc = await fs.readJson(pFile);
      let pl = pc.cLangList
      if (pc && pl) {
        for (const rl of cLangList) {
          if (!pl.find((sl) => sl.lang === rl.lang)) {
            pl.push(rl)
          }
        }
        cLangList = pl
      }
    }
  }
  return cLangList
}
