const User = require('../../../model/userSchema');

const validator = require('../../../middleware/validator');
const { body } = require('express-validator');
const AuthCode = require('../../../model/authCodeSchema');

// 注册验证
const registerValid = // 注册验证
  (exports.registerValid = validator([
    body('nickname')
      .exists()
      .withMessage('请输入昵称!')
      .bail()
      .notEmpty()
      .withMessage('用户名不能为空!'),
    body('password')
      .notEmpty()
      .withMessage('用户密码不能为空')
      .bail()
      .isLength({ min: 6 })
      .withMessage('密码长度小于6'),
    body('email')
      .notEmpty()
      .withMessage('邮箱不能为空')
      .bail()
      .isEmail()
      .withMessage('请输入合法邮箱')
      .bail()
      .custom(async (email) => {
        const user = await User.findOne({ email });
        if (user) {
          return Promise.reject('邮箱已存在!!!');
        }
      }),
    body('gender')
      .isInt()
      .withMessage('请输入数字类型数据')
      .bail()
      .custom(async (gender, { req }) => {
        if (![0, 1].includes(Number(gender))) return Promise.reject('0:女生,1:男生!!');
      })
      .bail()
      .toInt(),
    body('captcha')
      .exists()
      .withMessage('请输入验证码！')
      .bail()
      .isLength({ max: 6, min: 6 })
      .withMessage('验证码不合法！')
      .bail()
      .custom(async (captcha, { req }) => {
        const { email } = req.body;
        // 判断是否有验证码 大于现在日期的
        const codeInfo = await AuthCode.find({ email })
          .where('expireTime')
          .gte(new Date())
          .sort({ expireTime: -1 })
          .limit(1);

        if (codeInfo.length === 0) {
          return Promise.reject('验证码不存在或邮箱错误!!!');
        }
        if (codeInfo[0].captcha && codeInfo[0].captcha !== captcha) {
          return Promise.reject('验证码错误!!!');
        }
      }),
    // body('auth').isIn(['user', 'admin', 'super']).withMessage('请输入合法权限！！').bail(),
  ]));

const register = async (req, res, next) => {
  try {
    console.log('req: ', req.body);

    // 验证通过保存到数据库
    let user = new User(req.body);
    await user.save();

    // 去掉密码
    user = user.toJSON();
    delete user['password'];

    // 发送成功响应

    res.status(201).json({ code: 200, message: '成功！', data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = [registerValid, register];
