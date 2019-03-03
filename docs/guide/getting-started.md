# 快速上手

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

## 简单尝试

执行 Shell 命令

```bash
$ gckit g product vc
```

然后会在当前目录下生成对应文件
<img :src="$withBase('/icons/guide-getting-started-001.png')" alt="001">

> 执行命令会相对于当前目录，根据默认配置生成`Swift`语言`ViewController`类型的文件

### 说明

- `vc`:指定生成的文件类型为`ViewController`
- `product`:为输入的参数**name**
- `g`为`generate`的缩写,代表生成文件
