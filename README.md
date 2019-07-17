# Gckit-CLI

<div align=center><img width="150" height="150" src="./docs/img/logo.png"/></div>

**Gckit-CLI**代码生成的命令行工具，主要针对`iOS`(当然也支持自定义，比如`Dart`、`Java`)开发过程中`Swift`或者`Objective-C`语法的文件生成，可以通过一个简单的`JSON`文件即可生成对应的`ViewController`、`Model`、`Cell`等文件，生成的文件类型、文件路径都可以自定义。`一键生成`最大的提高了开发效率，再也不用`复制`、`粘贴`操作了，开发者只需关注业务代码的开发和 UI 界面的绘制。

## 安装

### Node.js 环境

```bash
$ brew install node
```

> 更多安装方式可以参考[Node.js 官方息息](https://nodejs.org/en/download/)

安装完成后，可以使用以下命令检测是否安装成功：

```bash
$ node -v
v10.7.0
$ npm -v
6.4.1
```

### 安装 Gckit CLI 工具

```bash
$ npm install gckit -g
```

然后执行命令检测是否安装成功

```bash
$ gckit --help
```

## 使用

### 查看命令参数

```bash
$ gckit --help
Usage: gckit [options] [command] <command>

Options:
  -h, --help            output usage information

Commands:
  generate|g [options]  生成对应语言的文件
  config|c [options]    基本参数配置

  运行 gckit <command> --help 查看详细帮助信息.
```

### 简单尝试

执行 Shell 命令

```bash
$ gckit g product vc
```

然后会在当前目录下生成对应文件:

![001](./docs/.vuepress/public/icons/guide-getting-started-001.png)

> 执行命令会相对于当前目录，根据默认配置生成`Swift`语言`ViewController`类型的文件

- `vc`:指定生成的文件类型为`ViewController`
- `product`:为输入的参数**name**
- `g`为`generate`的缩写,代表生成文件

### 体验一键生成

![001](./docs/.vuepress/public/icons/cocoapods-001.gif)

首先保证在`tempJson`文件夹下存在`name`为`"product"`的`JSON`文件

然后执行 Shell 命令:

```bash
$ gckit g product
```

默认提供的`Swift`模板，需要依赖三个开源库才可以编译通过:

```
 s.dependency 'UtilCore', '~> 0.1.0'
 s.dependency 'NetWorkCore', '~> 0.1.0'
 s.dependency 'EmptyDataView', '~> 0.1.0'
```

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/SeongBrave/gckit/graphs/contributors"><img src="https://opencollective.com/gckit/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/gckit/contribute)]

#### Individuals

<a href="https://opencollective.com/gckit"><img src="https://opencollective.com/gckit/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/gckit/contribute)]

<a href="https://opencollective.com/gckit/organization/0/website"><img src="https://opencollective.com/gckit/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/gckit/organization/1/website"><img src="https://opencollective.com/gckit/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/gckit/organization/2/website"><img src="https://opencollective.com/gckit/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/gckit/organization/3/website"><img src="https://opencollective.com/gckit/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/gckit/organization/4/website"><img src="https://opencollective.com/gckit/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/gckit/organization/5/website"><img src="https://opencollective.com/gckit/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/gckit/organization/6/website"><img src="https://opencollective.com/gckit/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/gckit/organization/7/website"><img src="https://opencollective.com/gckit/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/gckit/organization/8/website"><img src="https://opencollective.com/gckit/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/gckit/organization/9/website"><img src="https://opencollective.com/gckit/organization/9/avatar.svg"></a>
