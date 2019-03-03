---
sidebar: auto
---

# 配置

> 以下的配置字段大部分都是`.gckitconfig`文件中存在，可以通过直接修改`.gckitconfig`中对应的字段来实现修改配置，理论上`配置`中的所有字段都可以在自定义模板文件中使用的，这样大家可以非常灵活的实现自己特定的需要的

## 基本配置

### organization

- Type: `string`
- Default: `'gckit'`

  表示组织机构。

### author

- Type: `string`
- Default: `'读取本机名称'`

  ::: tip 提示
  生成文件时头部的注释的`作者`名称显示。
  :::

### preset

- Type: `string`
- Default: `'normal'`

**Gckit CLI**为同一文件类型提供了`5种`不同的模板类型，比如在自定义`Swift`的`Model`类型时你可以提前自定义`Struct`、`Class`或者`SwiftJSON`、`ObjcetMapper`等不同的模板种类，在生成的时候可以灵活选择。

::: tip 提示

> 在执行文件生成之前，必须要实现对应类型的模板，以下代表的意思主要是针对`iOS`下`ViewController`的生成的时候，其它情况下就可以代表不同的模板种类了

`normal`: 系统生成

`common`: 简单的自定义方法

`inherit`: 继承父类、导入依赖名

`all`: 全量生成
:::

### list

- Type: `string`
- Default: `'none'`

指定生成文件的列表类型，该字段主要是针对**iOS**中生成`ViewController`类型时选择是否使用列表类型以及列表的种类(`UITableView` 或者 `UICollectionView`)

::: tip 提示
`none`: 无列表

`tv`: `UITableView`

`cv`: `UICollectionView`
:::

### force

- Type: `boolean`
- Default: `false`

  默认情况下，当生成文件时，如果已经存在则就不会覆盖。当然你可以将`force`设置为`true`表示强制覆盖。

::: warning 注意
该字段是针对普通文件类型有效，如果文件类型的`isProject`为**true**时(表示生成的文件类型为项目级别的)当`force`设置为`true`也不会强制覆盖，而是会弹出询问是否强制覆盖的
:::

### isDeep

- Type: `boolean`
- Default: `true`

  表示生成`Model`类型时，是否需要根据`JSON`文件的不同层级分别生成`Model`，默认为`true`，表示生成不同层级的`Model`，否则生成最顶级的`Model`。

### tempJPath

- Type: `string`
- Default: `tempJson`

  表示生成文件时，读取`JSON`文件的相对文件夹路径名称。

### mainPath

- Type: `string`
- Default: `Main`

  表示生成文件时，生成的文件相对于当前的路径，默认为`Main`文件夹，不过可以通过配置时输入`空格`实现生成的文件为当前目录，另外如果是与 CocoaPods 组件化配合使用，则默认会设置为`Classes`文件夹。

### gTypes

- Type: `Array`
- Default: `[ "viewcontroller", "viewmodel", "model", "cell", "api", "router", "core" ]`

  改字段是在执行`一键生成`(即:在执行生成文件时没有指定要生成的文件类型，默认会生成对应哪几种类型)。

::: warning 注意
该字段的配置需要与语言字段**lang**一定要配合使用，例如该字默认表示:`Swift`语言下执行`一键生成`时会分别生成:`viewcontroller`、 `viewmodel`、 `model`、 `cell`、 `api`、 `router`、 `core`，这些模板类型只有在`Swift`语言下才是有效的。
:::

### prefix

- Type: `string`
- Default: ``

  表示生成文件名称需要增加的前缀，该字段大部分情况下是不需要配置的，只有`lang`为`Objective-C`(没有命名空间)时才会配置改字段(🤪OC 特有)

## 文件类型

### gType.path

- Type: `String`
- Default: `对应类型`

表示对应类型的相对路径，生成的每种类型都独立到各自的文件夹下以保证方便管理。

### gType.suffix

- Type: `String`
- Default: `_对应类型的缩写`（一种约定）

通过输入的`Name`名称然后再加上文件类型的`suffix`即可生成对应类型的名称了。

### gType.isProject

- Type: `boolean`
- Default: `false`

表示该类型是否为项目级别，如果是项目级别的`文件名称`不会根据输入的`Name`生成而是根据`项目的名称`加上文件类型的`suffix`所生成。

### cGTypes

- Type: `Array`
- Default: `[]`

  用于缓存用户自定义配置的文件类型，包含的子字段有:

  - gType:表示自定义类型名称
  - path:对应类型的相对路径
  - suffix:对应类型的后缀
  - isProject:表示对应类型是否为项目级别

::: tip 提示
用户可以通过下面命令进行自定义文件类型，该字段就是用于缓存用户自定义的文件类型

```bash
$ gckit c -g
```

:::

## 语言

### lang

- Type: `string`
- Default: `swift`

  表示生成文件的语言。`lang`需要与生成类型`gTypes`对应

### cLangList

- Type: `Array`
- Default: `[]`

  用于缓存用户自定义配置的语言列表，包含的子字段有:

  - lang:语言的名称
  - ext:语言对应文件的格式
  - hasPrefix:是否包含前缀
  - types:表示语言的数据类型用于生成对应的`Model`的时候需要
  - crossPlatform:是否是跨平台语言(跨平台考虑区别大小写问题文件名为小写下划线的形式，否则大写)

::: tip 提示
用户可以通过下面命令进行自定义语言，该字段就是用于缓存用户自定义的语言列表

```bash
$ gckit c -l
```

:::
