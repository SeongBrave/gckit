# 基本配置

## 配置文件

`.gckitconfig`为配置文件，如果用户自己配置了一次即会在用户目录下会生成一个`.gckit`文件夹中包含一个`.gckitconfig`的文件，当然系统也会默认提供一个配置文件，另外你也可以单独为某一个项目生成一个项目级别的配置文件

`Gckit CLI`提供了三种配置级别，分别为:`项目级别` `用户级别` `Gckit CLI默认`

::: tip 提示

> 配置文件的加载顺序为:`项目级别` -> `用户级别` -> `Gckit CLI默认`

即:如果当前项目存在`配置文件`，则当前项目中使用`Gckit CLI`会依据当前项目的配置生成文件，`用户级别`的`配置文件`是不起作用的

`Gckit CLI默认`配置文件只有在没有配置过`项目级别` 和 `用户级别`配置文件时才会起作用
:::

配置文件显示目录级别，如果是`用户级别`的则会在系统的用户根目录存在以下目录，如果是`项目级别`的则会在当前项目的根目录下存在

```
.
├─ .gckit
│  │
│  └─ .gckitconfig
```

### config 命令相关参数

执行 Shell 脚本查看帮助信息

```bash
$ gckit c --help
```

然后显示下面信息

```
Usage: config|c [options]

基本参数配置

Options:
  -p, --project  本项目配置,当前文件夹下增加gckitconfig,默认是用户目录下
  -f, --force    强制覆盖配置文件
  -s, --show     查看对应配置文件
  -g, --cgtype   自定义生成文件类型
  -l, --clang    自定义生成语言
  -h, --help     output usage information
```

## 默认配置文件

> 没有配置过，就会读取默认的配置文件

```json
{
  "organization": "gckit",
  "author": "seongbrave",
  "preset": "all",
  "list": "tv",
  "force": false,
  "isDeep": true,
  "tempJPath": "tempJson",
  "mainPath": "Main",
  "gTypes": [
    "viewcontroller",
    "viewmodel",
    "model",
    "cell",
    "api",
    "router",
    "core"
  ],
  "viewcontroller": {
    "path": "ViewController",
    "suffix": "_vc",
    "isProject": false
  },
  "viewmodel": {
    "path": "ViewModel",
    "suffix": "_vm",
    "isProject": false
  },
  "model": {
    "path": "Model",
    "suffix": "_model",
    "isProject": false
  },
  "cell": {
    "path": "View/Cell",
    "suffix": "_cell",
    "isProject": false
  },
  "api": {
    "path": "Api",
    "suffix": "_api",
    "isProject": false
  },
  "router": {
    "path": "Module",
    "suffix": "_router",
    "isProject": true
  },
  "lang": "swift",
  "prefix": "",
  "cLangList": [],
  "cGTypes": [
    {
      "gType": "core",
      "path": "Module",
      "suffix": "Core",
      "isProject": true
    }
  ]
}
```

## 设置用户配置

### 设置用户配置

执行 Shell 脚本进行用户配置

```bash
$ gckit c
```

具体操作可以参考以下 GIF 动图演示

<img :src="$withBase('/icons/basic-config-001.gif')" alt="002">

::: warning 注意
如果提示文件已存在的错误，则可以增加参数`-f`表示强制覆盖配置文件
:::

### 设置项目级别的配置

> 与上面的命令差不多，增加参数`-p`即表示配置项目级别的配置

执行 Shell 脚本进行项目级别配置，其它操作与上面类似

```bash
$ gckit c -p
```

## 查看配置的信息

> 增加`-s`参数即可查看，如果包含`-p`参数则查看的是`项目级别`的配置，否则查看的是`用户级别`的配置信息

查看当前项目的配置信息

```bash
$ gckit c -p -s
```
