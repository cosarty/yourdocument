> 服务端返回的格式统一

```javasript
data:{
  code:状态码,
  message:消息,
  data:数据如果失败则为空
   }
```

校验级别

```json
1、isLenth({mix:5,max:6})
2、isEmail()
3、normalizeEmail()
4、not()
5、trim()
6、escape()
7、toBoolean()
8、custom() 自定义 校验
9、withMessage()
10、matches(/\d/)  正则校验
11、toInt()
12、isInt()
13、isNumeric
14、exists 是否存在
15、optional()可选
// .not().isIn(['sunday', 'saturday']); 否定

// -----消毒链
16、customSanitizer()  // 自定义消毒链
//   param('id').customSanitizer((value, { req }) => {
  //   return req.query.type === 'user' ? ObjectId(value) : Number(value);
  // }),
17、default('foo')
18、replace()


equals()
isAlpha()
isAlphanumeric()
isAscii()
isBase64()
isBoolean()
isCurrency()
isDecimal()
isEmpty()
isFQDN()
isFloat()
isHash()
isHexColor()
isIP()
isIn()
isInt()
isJSON()
isLatLong()
isLength()
isLowercase()
isMobilePhone()
isNumeric()
isPostalCode()
isURL()
isUppercase()
isWhitelisted()
toDate()
isArray()
isObject()
```
