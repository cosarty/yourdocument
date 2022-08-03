/**
 * 用户验证
 */

const validator = require('../middleware/validator');
const { body } = require('express-validator');
const md5 = require('../util/md5');
// 获取模型
const User = require('../model/user');
const AuthCode = require('../model/authCode ');

// 注册验证
exports.registerValid = validator([
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
    .exists()
    .withMessage('请输入性别')
    .bail()
    .isIn([0, 1])
    .withMessage('性别不合法！！'),
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

      if (codeInfo.expireTime && codeInfo.expireTime !== captcha) {
        return Promise.reject('验证码错误!!!');
      }
    }),
]);

// 登录
exports.loginValid = [
  validator([
    body('email').notEmpty().withMessage('邮箱不能为空！！'),
    body('password').notEmpty().withMessage('密码不能为空'),
  ]),
  validator([
    body('email').custom(async (email, { req }) => {
      // 告诉他我需要password
      const user = await User.findOne({ email }).select([
        'username',
        'password',
        'email',
        'image',
        'bio',
      ]);
      if (!user) {
        return Promise.reject('用户不存在!!!');
      }

      // 将用户挂载到请求对象
      req.user = user;
    }),
  ]),
  validator([
    body('password').custom(async (password, { req }) => {
      if (md5(password) !== req.user.password) {
        return Promise.reject('密码错误!!!');
      }
    }),
  ]),
];

exports.sendMailValid = validator([
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为空！！')
    .bail()
    .isEmail()
    .withMessage('请输入合法邮箱')
    .bail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) return Promise.reject('用户已注册!!!');
    }),
]);
