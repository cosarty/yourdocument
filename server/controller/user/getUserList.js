const UserModel = require('../../model/userSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const getUserListValid = [
  validator([body('is_ban').optional().isBoolean().withMessage('is_ban 是布尔值')]),
];

/**
 * 获取用户列表
 * @param {} req
 * @param {*} res
 * @param {*} next
 */
const getUserList = async (req, res, next) => {
  try {
    const { auth: currenAuth } = req.user;
    const { is_ban = false } = req.body;
    let auth;

    // 不同用户只能查看不同权限的用户
    if (currenAuth === 'admin') auth = 'user';
    if (currenAuth === 'super') auth = ['admin', 'user'];

    const queryUser = () => UserModel.find().where({ auth, is_ban });

    const userList = await queryUser();
    const total = await queryUser().count();

    res.status(202).json({
      code: 202,
      message: '获取成功!!',
      data: { userList, total },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = [getUserListValid, getUserList];
