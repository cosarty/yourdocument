const UserModel = require('../../model/userSchema');
const validator = require('../../middleware/validator');

const banUserValid = [
  validator([validator.isValidObjectId(['body'], 'userId')]),
  async (req, res, next) => {
    const user = await UserModel.findById(req.body.userId);
    if (!user) return res.status(403).send({ code: 403, message: '用户不存在！！', data: null });
    const curAuth = req.user.auth;
    if (curAuth === 'admin' && user.auth !== 'user')
      return res.status(403).send({ code: 403, message: '您只能ban普通用户', data: null });
    next();
  },
];

// TODO  解封到时候看情况做
/**
 * 设置权限
 * @param {} req
 * @param {*} res
 * @param {*} next
 */
const banUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    await UserModel.findByIdAndUpdate(userId, { is_ban: true }, { new: true });
    res.status(202).json({
      code: 202,
      message: '封号成功!!',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = [banUserValid, banUser];
