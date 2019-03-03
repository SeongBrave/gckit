---
sidebar: auto
---

# 模板

## 介绍

<Bit/>
**Gckit-CLI**文件生成最重要的条件就是需要模板的支持，每一种语言的每一种文件类型都需要唯一的一种模板所对应支持。系统默认提供了一套简单的模板，大家也可以根据需要自定义自己的一套适用的模板。

::: tip 提示
 在执行文件生成时，必须保证对应的模板已经配置自定义。

- 所有的语言文件类型的模板都可以支持用户自定义，只需要将自定义的模板文件放到`.gckit`的`templates`文件夹下即可
- 当然大家可以贡献自己的模板，可以通过给我发 issue 提供您理想的模板
- 推荐大家 Clone 一份[gckit-templates](https://github.com/SeongBrave/gckit-templates)然后根据需要自定义自己的模板
- `.gckit`目录下存放`templates`文件夹底下即可

:::

### 目录结构

模板文件的文件组织结构大概如下:

```bash
.
├── config
└── templates
    └── swift
        ├── api
        │   ├── all.template
        │   ├── common.template
        │   ├── inherit.template
        │   └── normal.template
        ├── cell
        │   ├── all.template
        │   ├── common.template
        │   ├── inherit.template
        │   └── normal.template
        ├── core
        │   ├── all.template
        │   ├── common.template
        │   ├── inherit.template
        │   └── normal.template
```

以`Swift`语言模板为例，在`templates`目录底下，顶级目录为语言(`Swift`首字母小写与`.gckitconfig`中的`lang`字段对应)，然后是各个文件类型目录(`viewcontroller`、`model`、`cell`...)，然后是对应的模板文件，一般情况提供了
`normal`、`common`、`inherit`、`all`四种不同的模板

### 加载顺序

模板文件可以加载系统提供的，也可以自定义存放到`系统用户目录`底下的`.gckit`目录下，当然也可以存放到`项目级别`的`.gckit`目录下，加载顺序是:

```bash
#与`.gckitconfig`文件的加载顺序是一样的
项目级别 -> 用户级别 -> Gckit-CLI 默认
```

- 优先级最高为: `项目级别`，当前项目下 存在`.gckit`并且对应的模板文件存在就优先加载
- 次优先级为:`用户级别`，当项目目录下找不到对应的模板就会到系统的用户目录对应的`.gckit`目录下寻找，如果能找到就加载
- 最低优先级为:`Gckit-CLI`默认提供的，当`项目级别`和`用户级别`都找不到最好才会匹配默认提供的模板

## 自定义模板

如果`Gckit-CLI`默认提供的模板满足不了自己的需求时，可以通过自定义模板来实现
自定义模板的步骤:

1. 首先 Clone 一份[gckit-templates](https://github.com/SeongBrave/gckit-templates)项目
2. 然后将 Clone 的项目中`templates`文件夹拷贝到用户目录`.gckit`或者项目的`.gckit`文件夹下
3. 找到对应语言对应文件类型的模板，然后根据`.gckitconfig`中的配置参数自定义模板
