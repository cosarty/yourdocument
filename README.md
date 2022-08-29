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
