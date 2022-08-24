const UserModel = require('../../../model/userSchema');

/**
 * 检测用户是否合法
 * @param {*} userId
 */
exports.checkUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user || user.is_ban) return Promise.reject('用户不存在');
  return user;
};

exports.getUserInfo = async (userId) => await UserModel.findById(userId).populate('favours');
