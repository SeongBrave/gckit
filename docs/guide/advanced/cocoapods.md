# CocoaPods 中的使用

> `CocoaPods`只适用对`iOS`项目模块化中的使用，生成其它语言时可以忽略。推荐与`CocoaPods`结合使用，默认提供的`一键生成`也是配合`CocoaPods`模块化中使用的，**Gckit-CLI**也是基于在`CocoaPods`模块化开发过程中重复创建文件而开发的，所以**Gckit-CLI**在`CocoaPods`模块化开发中特别适用。

`CocoaPods`是为了实现模块复用，而`Gckit CLI`是为了减少无用的手工操作，通过结合二则之后，理想的情况就是：我们只需要关注具体的业务逻辑，再也不会有复制粘贴等无用的操作了 👏，极大的提高了开发效率。

尽量避免手动复制代码，重复的代码即可以通过`CLI`去完成，而项目之间有重复的模块，则可以通过`CocoaPods`实现公用代码模块化进而实现代码的复用。不仅能提高开发效率，而且还能进一步降低低级 Bug 的出现。

::: warning 注意
系统默认提供了`一键生成`，配合`CocoaPods`使用，在执行完脚本:`gckit g product`之后，还需两步操作:

1. 要修改下`.podspec`文件，增加依赖的第三方库:

```
  s.dependency 'UtilCore', '~> 0.1.0'
  s.dependency 'NetWorkCore', '~> 0.1.0'
  s.dependency 'EmptyDataView', '~> 0.1.0'
```

2. 修改对应的 Cell 文件，与`Storyboard`绑定

   ```Swift
   class  Product_tCell: UITableViewCell {

    @IBOutlet weak var text_lb: UILabel!

    var item:Product_model? {
        didSet {

        }
    }

    override func awakeFromNib() {

    }
   }
   ```

   在执行完毕以上两部操作之后就可以成功运行了。网络请求、数据解析等操作都已经写好了。
   :::

目前情况下在执行完`一键生成`命令之后还需要用户手动或者`Storybard`绘制界面，然后绑定字段。
