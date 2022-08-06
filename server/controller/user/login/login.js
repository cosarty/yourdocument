const User = require('../../../model/user');
const { createToken } = require('../../../util/jwt');
const validator = require('../../../middleware/validator');
const { body } = require('express-validator');
const md5 = require('../../../util/md5');
// 获取模型

// 登录验证

const loginValid = [
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

// 登录
const login = async (req, res, next) => {
  // 登录
  try {
    const user = req.user.toJSON();
    delete user.password;
    const token = await createToken({ userId: user._id });

    res.status(200).json({
      code: 200,
      message: '成功',
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = [loginValid, login];
