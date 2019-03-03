# 文件生成

::: tip 提示
生成文件大部分都是根据用户输入的`name`字段，然后再分别根据生成类型`GType`决定生成文件类型，在`name`增加`前缀`或者`后缀`的形式生成不同的文件,最后再根据配置文件指定具体的文件`路径`生成对应的文件
:::

## 参数介绍

### `generate` 命令相关参数

执行 Shell 脚本查看帮助信息

```bash
$ gckit g --help
```

然后显示下面信息

```
Usage: generate|g [options]

生成对应语言的文件

Options:
  -m, --moduleName <moduleName>  配置项目名称,如果不指定则自动获取
  -p, --preset                   选择对应的模板类型
  -l, --list                     选择列表类型
  -f, --force                    强制覆盖文件
  -i, --ispublic                 生成Model的时候Swift的访问控制
  -h, --help                     output usage information
```

::: warning 警告
生成文件的时候必须存在对应`语言`的对应`生成类型`的`模板`
:::

## 生成指定文件

> **Gckit CLI**最主要的功能就是文件生成

### ViewController 和 Model

#### ViewController

> `ViewController`可以通过增加参数`ViewController`、`controller`、`vc`指定

执行脚本

```bash
$ gckit g product viewcontroller
```

或者也可以简写为`vc`即:

```bash
$ gckit g product viewcontroller
```

可以指定生成列表类型为`UITableView`

```bash
$ gckit g product viewcontroller tv
```

或者也可以指定询问生成文件内容的类型

```bash
$ gckit g product viewcontroller tv -p
```

#### Model

::: warning 注意

生成`Model`时，**Gckit CLI**会到指定文件夹(默认为`tempJson`)下读取一个对应文件名的`JSON`文件，自动根据 `JSON` 文件生成对应的 `Model`，
生成的结构是由模板确定的，如果不满足自己的需求可以通过自定义模板实现生成`Model`文件的自定义。
:::

```bash
$ gckit g product model
```

### 生成其它文件

::: tip 提示

1. `Objective-C`目前`默认模板`只支持`ViewController`、`Mode`文件的生成，如果需要的可以通过参考[文件类型配置](./advanced/gtype-config.md)来自定义配置
2. 以下文件类型是系统默认支持`Swift`
3. 另外可以参考[文件类型配置](./advanced/gtype-config.md)自定义文件类型
   :::

#### ViewModel

```bash
$ gckit g product viewmodel
```

或者使用简写

```bash
$ gckit g product vm
```

#### Api

```bash
$ gckit g product api
```

#### Router

```bash
$ gckit g product router
```

#### Core

```bash
$ gckit g product core
```

## 一键生成

> **Gckit CLI**支持一键生成多个文件

首先在配置文件的时候，指定默认生成的类型，如下图所示

<img :src="$withBase('/icons/generate-001.png')" alt="002">

然后只需执行以下 Shell 命令即可生成多个文件

```bash
gckit g product
```
