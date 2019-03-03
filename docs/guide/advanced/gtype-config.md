# 文件类型配置

目前默认提供了`Objective-C`语言文件类型有:`ViewController`和`Mode`两种类型，`Swift`语言的文件类型有:
`ViewController`、`ViewModel`、`Mode`、`Cell`、`Api`、`Router`、`Core`七种类型
如果这些文件类型满足不了需求可以通过自定义`文件类型配置`

通过查看[config 命令相关参数](../basic-config.md#config命令相关参数)

::: tip 提示
`-g, --cgtype 自定义生成文件类型`

配置的时候增加`-g`参数进行`文件类型配置`
:::

执行 Shell 脚本进行文件类型配置

```
$ gckit c -g
```

## 流程梳理

### cGTypes 字段配置

参考一下动图进行`cGTypes`字段的配置

<img :src="$withBase('/icons/gtype-config-001.gif')" alt="001">

### 修改默认生成文件类型

::: warning 注意
`cGTypes`最好配置成`用户级别`的，即不要配置成`项目级别`，因为`项目级别`的只能是针对该项目使用，其它项目不能使用
:::

配置完`cGTypes`字段之后，重新执行配置文件，即可看到刚才新增的语言

<img :src="$withBase('/icons/gtype-config-002.png')" alt="002">

### 编辑模板文件

::: warning 注意
需要在模板文件夹下创建对应语言对应文件类型的模板
:::

### 文件生成

最后执行执行简单的的 Shell 脚本命令即可，更多细节请查阅[文件生成](../generate.md):

```bash
$ gckit g product
```

或者直接执行

```bash
$ gckit g java product
```

::: warning 注意
🥶 `文件类型配置`应该是根据`语言配置`的，考虑到`语言配置`的复杂度就没有这么做，文件类型配置不依赖语言的配置，这样会造成一种现象就是:

- 如果给每个语言配置一种特有的文件类型，比如`Swift`下配置了特有的`Route`
- 而在配置`Objective-C`的时候会显示`Route`的配置，按理说在配置的时候，如果选择了`Objective-C`就不应该显示专门针对`Swift`类型的`Route`了
  :::
