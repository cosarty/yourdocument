const UserModel = require('../../model/userSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const setPermissionValid = [
  validator([validator.isValidObjectId(['body'], 'userId')]),
  validator([
    body('auth')
      .exists()
      .withMessage('请输入权限')
      .isIn(['admin', 'user'])
      .withMessage('权限只能 : admin 管理员  user 普通用户'),
  ]),
  async (req, res, next) => {
    const user = await UserModel.findById(req.body.userId);
    if (!user) return res.status(403).send({ code: 403, message: '用户不存在！！', data: null });
    if (user.auth === req.body.auth)
      return res.status(202).send({ code: 202, message: '不能设置当前权限哦！！', data: null });
    next();
  },
];

/**
 * 设置权限
 * @param {} req
 * @param {*} res
 * @param {*} next
 */
const setPermission = async (req, res, next) => {
  try {
    const { userId, auth } = req.body;

    await UserModel.findByIdAndUpdate(userId, { auth }, { new: true });
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
