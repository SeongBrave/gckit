# 语言配置

`Gckit CLI`默认只支持生成`Objective-C`和`Swift`语法的文件，主要是针对`iOS`项目的支持。不过也可以通过自定义[cLangList](../../config/README.md#preset)简单的实现针对其它语言文件的支持

通过查看[config 命令相关参数](../basic-config.md#config命令相关参数)

::: tip 提示
`-l, --clang 自定义生成语言`

配置的时候增加`-l`参数进行`语言配置`
:::

执行 Shell 脚本进行语言配置

```
$ gckit c -l
```

## 流程梳理

### cLangList 字段配置

参考一下动图进行`cLangList`字段的配置

<img :src="$withBase('/icons/lang-config-001.gif')" alt="001">

### 修改选择语言

::: warning 注意
`cLangList`最好配置成`用户级别`的，即不要配置成`项目级别`，因为`项目级别`的只能是针对该项目使用，其它项目不能使用
:::

配置完`cLangList`字段之后，重新执行配置文件，即可看到刚才新增的语言

<img :src="$withBase('/icons/lang-config-002.png')" alt="002">

### 编辑模板文件

::: warning 注意
需要在模板文件夹下创建对应语言对应文件类型的模板
:::

### 文件生成

最后执行执行简单的的 Shell 脚本命令即可，更多细节请查阅[文件生成](../generate.md):

```bash
$ gckit g product
```
