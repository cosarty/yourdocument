const UserModel = require('../../model/userSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

// 获取模型

// 登录验证

const setPermissionValid = [
  validator([validator.isValidObjectId(['body'], 'userId')]),
  async (req, res, next) => {
    const user = await UserModel.findById(req.body.userId);
    if (!user) return res.status(403).send({ code: 403, message: '用户不存在！！', data: null });
    next();
  },
  validator([
    body('auth')
      .exists()
      .withMessage('请输入权限')
      .isIn(['admin', 'user'])
      .withMessage('权限只能 : admin 管理员  user 普通用户'),
  ]),
];

// 登录
const setPermission = async (req, res, next) => {
  // 登录
  try {
    const { userId, auth } = req.body;
    UserModel.findByIdAndUpdate(userId, { auth }, { new: true });
    res.status(202).json({
      code: 202,
      message: '设置成功',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = [setPermissionValid, setPermission];
