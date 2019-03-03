# 介绍

<img :src="$withBase('/icons/gckit-process.png')" alt="002">

**Gckit CLI** 通过 Node.js 脚本实现生成`Swift`、`Objective-C`等代码的命令行工具，如上图所以，通过`01`用户输入一个`name`**Gckit CLI**就能自动生成对应右侧`03`所示的`ViewController`、`Model`、`ViewModel`等文件。

通过用户自定义的模板不仅能提高开发`效率`而且还能保持团队统一的代码`编码规范`。

## 流程说明

> 根据上图显示，主要分为三步，分别为:用户录入、Gckit CLI 数据处理、输出代码文件

如上图 所示

- `01` : 首先接收用户输入`name`，这块会校验`name`是否关键字等合法性验证，`name`是文件代码生成的前提
- `02` : 通过读取配置文件和模板文件，然后再根据配置文件`.gckitconfig`和模板文件对输入的`name`进行加工
- `03` : 通过 `02` 加工之后的数据生成对应的文件，并且根据配置文件写入对应的文件夹中如 `03` 所示

## 为什么要使用**Gckit CLI**

- 尽可能的降低了低级的拼写错误导致的 Bug
- `效率至上`，只需要一个`JSON`文件，即可`一键生成`对应的所有代码(`ViewController`、`Model`、`ViewModel`...)
- 用户纬度，项目纬度的统一代码风格
- 开发过程中始终保持`"约定大于配置"`的思想，大家都遵循一套约定，进而提高团队开发效率
- 更多的精力关注逻辑业务代码，而无需再重复无用的拷贝粘贴

## 比较优雅的开发方式

<img :src="$withBase('/icons/cocoapods-001.gif')" alt="002">

### 简单说明

首先保证在`tempJson`文件夹下存在`name`为`"product"`的`JSON`文件

然后执行 Shell 命令:

```bash
$ gckit g product
```

## JSON 转 Model

首先保证在`tempJson`文件夹下存在`name`为`"product"`的`JSON`文件:

```json
{
  "createdAt": 1544337847675,
  "updatedAt": 1544337847675,
  "id": "5c0cb9b76cd2900e9971393b",
  "desc": "荣耀 畅玩7X 4GB+32GB 全网通4G全面屏手机 标配版 铂光金",
  "pdname": "华为",
  "attr": "4GB^32GB",
  "imageurl": "https://img12.360buyimg.com/n2/s240x240_jfs/t10315/227/1754541026/256693/980afae7/59e5bdf4Nb6b9904a.jpg"
}
```

然后执行 Shell 命令:

```bash
$ gckit g product model
```

👏 然后就生成 Swift 语言的 Model 文件:

```swift
import Foundation
import SwiftyJSON
import ModelProtocol

class Product_model: ModelProtocol {

   // MARK: Declaration for string constants to be used to decode and also serialize.
    internal let kproductCreatedAtKey: String = "createdAt"
    internal let kproductUpdatedAtKey: String = "updatedAt"
    internal let kproductIdKey: String = "id"
    internal let kproductDescKey: String = "desc"
    internal let kproductPdnameKey: String = "pdname"
    internal let kproductAttrKey: String = "attr"
    internal let kproductImageurlKey: String = "imageurl"

    // MARK: 属性

     var createdAt: Int
     var updatedAt: Int
     var productid: String
     var desc: String
     var pdname: String
     var attr: String
     var imageurl: String

    // MARK: 实现MikerSwiftJSONAble 协议， 解析json数据
    public required  init?(json: JSON) {

        createdAt  = json[kproductCreatedAtKey].intValue
        updatedAt  = json[kproductUpdatedAtKey].intValue
        productid  = json[kproductIdKey].stringValue
        desc  = json[kproductDescKey].stringValue
        pdname  = json[kproductPdnameKey].stringValue
        attr  = json[kproductAttrKey].stringValue
        imageurl  = json[kproductImageurlKey].stringValue

    }

}
```

当然生成`Model`也可以通过模板实现自定义，系统默认提供了支持`Swift`和`Objective-C`版本的，可以根据需要进行自定义
