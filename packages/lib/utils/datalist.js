const _ = require('lodash');
const {
  hostname,
} = require('../../shared-utils/index.js')
const datalist = {
  /*
  选择生成的语言
  */
  langList: [{
    lang: "swift",
    ext: "swift",
    hasPrefix: false,
    //区别大小写
    crossPlatform: false,
    types: {
      obj: 'Object',
      array: 'Array',
      double: 'Float',
      int: 'Int',
      boolean: 'Bool',
      string: 'String',
    }
  }, {
    lang: "objc",
    ext: ['h', 'm'],
    hasPrefix: true,
    //区别大小写
    crossPlatform: false,
    types: {
      obj: 'obj',
      array: 'NSArray',
      double: 'CGFloat',
      int: 'NSInteger',
      boolean: 'BOOL',
      string: 'NSString',
    }
  }],
  /*
  生成模块类型
  normal: 1. 系统生成
  common: 2. 简单的自定义方法
  inherit: 3. 继承父类、导入依赖名
  all: 4. 全量生成
  */
  presetList: ['normal', 'common', 'inherit', 'all'],
  list: ['none', 'tv', 'cv'],
  /*
  generate关键字,如果命令行中包含这些关键字则说明是指定生成类型，则必须要获取下一位，否则获取本位
  用于输入时做筛选关键字,提取关键字吧
  */
  gkeyList: [{
    id: 'viewcontroller',
    filters: ['controller', 'vc', 'viewcontroller']
  }, {
    id: 'viewmodel',
    filters: ['viewmodel', 'vm']
  }, {
    id: 'model',
    filters: ['model']
  }, {
    id: 'cell',
    filters: ['cell', 'tcell', 'ccell']
  }, {
    id: 'api',
    filters: ['api']
  }, {
    id: 'router',
    filters: ['router']
  }, {
    id: 'core',
    filters: ['core']
  }],
  /**
   *判断是否包含generate关键字
   *
   * @param {*} name
   */
  isGKey: function (name) {
    return this.gkeyList.indexOf(_.toLower(name) || '') != -1;
  },
  /**
   *箭头函数的话会报错，箭头函数中的this是在定义函数的时候绑定，而不是在执行函数的时候绑定。
   *
   * @param {*} key
   * @returns
   */
  getGType: function (key) {
    for (const item of this.gkeyList) {
      if (item.filters.includes(key)) {
        return item.id
      }
    }
  }
}
const baseq = [{
    type: 'input',
    name: 'organization',
    message: '组织名称',
    default: 'Apple'
  },
  {
    type: 'input',
    name: 'author',
    message: '作者',
    default: hostname()
  }, {
    type: 'list',
    name: 'preset',
    default: 'normal',
    message: '生成文件类型',
    choices: datalist.presetList
  }, {
    type: 'list',
    name: 'list',
    default: 'none',
    message: 'tableview还是collectionview',
    choices: datalist.list
  }, {
    type: 'confirm',
    name: 'force',
    default: true,
    message: '是否覆盖文件?'
  }, {
    type: 'confirm',
    name: 'isDeep',
    default: false,
    message: '是否嵌套解析model?'
  }, {
    type: 'input',
    name: 'tempJPath',
    message: '读取JSON相对路径',
    default: 'tempJson'
  }, {
    type: 'input',
    name: 'mainPath',
    message: '生成文件相对路径',
    default: 'Main'
  }
]
const moduleq = {
  viewcontroller: [{
    type: 'input',
    name: 'path',
    default: 'ViewController',
    message: 'ViewController路径'
  }, {
    type: 'input',
    name: 'suffix',
    default: '_vc',
    message: 'ViewController后缀'
  }, {
    type: 'confirm',
    name: 'isProject',
    default: false,
    message: '是否项目文件?【如果项目文件就会更具project生成否则会根据name生成】'
  }],
  viewmodel: [{
    type: 'input',
    name: 'path',
    default: 'ViewModel',
    message: 'ViewModel路径'
  }, {
    type: 'input',
    name: 'suffix',
    default: '_vm',
    message: 'ViewModel后缀'
  }, {
    type: 'confirm',
    name: 'isProject',
    default: false,
    message: '是否项目文件?【如果项目文件就会更具project生成否则会根据name生成】'
  }],
  cell: [{
    type: 'input',
    name: 'path',
    default: 'View/Cell',
    message: 'cell路径'
  }, {
    type: 'input',
    name: 'suffix',
    default: '_cell',
    message: 'Cell的后缀'
  }, {
    type: 'confirm',
    name: 'isProject',
    default: false,
    message: '是否项目文件?【如果项目文件就会更具project生成否则会根据name生成】'
  }],
  model: [{
    type: 'input',
    name: 'path',
    default: 'Model',
    message: 'Model路径'
  }, {
    type: 'input',
    name: 'suffix',
    default: '_model',
    message: 'Model的后缀'
  }, {
    type: 'confirm',
    name: 'isProject',
    default: false,
    message: '是否项目文件?【如果项目文件就会更具project生成否则会根据name生成】'
  }],
  api: [{
    type: 'input',
    name: 'path',
    default: 'Api',
    message: 'Api路径'
  }, {
    type: 'input',
    name: 'suffix',
    default: '_api',
    message: 'Api的后缀'
  }, {
    type: 'confirm',
    name: 'isProject',
    default: false,
    message: '是否项目文件?【如果项目文件就会更具project生成否则会根据name生成】'
  }],
  router: [{
    type: 'input',
    name: 'path',
    default: 'Module',
    message: 'router路径'
  }, {
    type: 'input',
    name: 'suffix',
    default: '_router',
    message: 'router的后缀'
  }, {
    type: 'confirm',
    name: 'isProject',
    default: true,
    message: '是否项目文件?【如果项目文件就会更具project生成否则会根据name生成】'
  }],
  core: [{
    type: 'input',
    name: 'path',
    default: 'Module',
    message: 'core路径'
  }, {
    type: 'input',
    name: 'suffix',
    default: 'Core',
    message: 'core的后缀'
  }, {
    type: 'confirm',
    name: 'isProject',
    default: true,
    message: '是否项目文件?【如果项目文件就会更具project生成否则会根据name生成】'
  }]
}

module.exports = {
  datalist,
  baseq,
  moduleq,
  gckitKeys: [...baseq.map((i) => i.name), ...datalist.gkeyList.reduce((prev, value) => {
    return prev.concat(value.filters)
  }, []), ...datalist.langList.map((i) => i.lang), ...datalist.presetList, ...datalist.list],
  listExtObj: {
    [datalist.list[0]]: '',
    [datalist.list[1]]: 't',
    [datalist.list[2]]: 'c',
  }
};
