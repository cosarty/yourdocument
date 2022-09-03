# 试题君

# 启动

## 服务端

cd ./server npm run start

## web 端

yarn dev

# 补充

## antd 的自定义表单组件

两种实现方式

- 第一种:实例组件 SelectTag

> 自定义或第三方的表单控件，也可以与 Form 组件一起使用。只要该组件遵循以下的约定：

> 提供受控属性 value 或其它与 valuePropName 的值同名的属性。

> 提供 onChange 事件或 trigger 的值同名的事件。

- 第二种:实例组件 UploadImag

通过组件实例： formRef.current?.setFieldsValue({ [name]: value });

- 使用 mongose 过程中碰到的一些小坑
- aggregate 的 match 搜索 id 的时候必须先转换
  > .aggregate()
      .match({ _id: mongoose.Types.ObjectId(req.query.paperId) })
- 使用 Schema 的 getter 的使用必须这样子设置才能生效

  > userSchema.set('toJSON', { getters: true });

- 判断数据不为 null
  - questionId: { $ne: null },
  - .where('questionId') .ne(null)
