const User = require('../../../model/userSchema');
const { createToken } = require('../../../util/jwt');
const validator = require('../../../middleware/validator');
const { body } = require('express-validator');
const md5 = require('../../../util/md5');
// 获取模型

// 登录验证

const loginValid = [
  validator([
    body('email')
      .isEmail()
      .withMessage('请输入邮箱!!')
      .bail()
      .custom(async (email, { req }) => {
        // 告诉他我需要password
        const user = await User.findOne({ email }).populate('favours');
        if (!user) {
          return Promise.reject('用户不存在!!!');
        }
        // 将用户挂载到请求对象
        req.user = user;
      }),
    body('password').notEmpty().withMessage('密码不能为空').bail(),
  ]),
  // 这边再开一段中间件校验
  validator([
    body('password').custom((password, { req }) => {
      if (md5(password) !== req.user.password) {
        throw new Error('密码错误!!!');
      }
      return true;
    }),
  ]),
];

// 登录
const login = async (req, res, next) => {
  // 登录
  try {
    const user = req.user.toJSON();
    delete user.password;
    const token = await createToken({ user });
    // 判断是否是封号用户
    if (user.is_ban) {
      return res.status(403).json({
        code: 403,
        message: '您没有权限！',
        data: null,
      });
    }
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
