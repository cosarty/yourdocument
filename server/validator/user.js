/**
 * 用户验证
 */

const validator = require('../middleware/validator');
const { body, check } = require('express-validator');
const md5 = require('../util/md5');
// 获取模型
const User = require('../model/user');

// 注册验证
exports.registerValid = validator([
  body('username')
    .exists()
    .withMessage('请输入账号！！！')
    .bail()
    .notEmpty()
    .withMessage('用户名不能为空!'),
  body('password')
    .notEmpty()
    .withMessage('用户密码不能为空')
    .bail()
    .isLength({ min: 6 })
    .withMessage('密码长度小于6')
    .bail(),
  check('email')
    .notEmpty()
    .withMessage('邮箱不能为空')
    .bail()
    .isEmail()
    .withMessage('Not an email')
    .bail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        return Promise.reject('邮箱已存在!!!');
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
