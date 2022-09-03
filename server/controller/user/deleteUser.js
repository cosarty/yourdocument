const UserModel = require('../../model/userSchema');
const validator = require('../../middleware/validator');

const deleteUserValid = [
  validator([validator.isValidObjectId(['body'], 'userId')]),
  async (req, res, next) => {
    const user = await UserModel.findById(req.body.userId);
    if (!user || user.isDelete)
      return res.status(403).send({ code: 403, message: '用户不存在！！', data: null });
    if (user.auth === 'super')
      return res.status(403).send({ code: 403, message: '无法删除', data: null });
    next();
  },
];

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    await UserModel.findByIdAndUpdate(userId, { isDelete: true }, { new: true });
    res.status(202).json({
      code: 202,
      message: '删除成功!!',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = [deleteUserValid, deleteUser];
