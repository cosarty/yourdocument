const UserModel = require('../../model/userSchema');
const validator = require('../../middleware/validator');
const { query } = require('express-validator');

const getUserListValid = [
  validator([
    query('current').isInt().withMessage('页数必须是整型的').toInt(),
    query('pageSize').isInt().withMessage(' 页面大小必须是整型的').toInt(),
    query('auth').optional().isString().withMessage('title是字符串类型!!!'),
    query('nickname').optional().isString().withMessage('名称是字符串类型!!!'),
  ]),
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
    // req.params;
    const { current, pageSize, auth, nickname } = req.query;

    let au;

    // 不同用户只能查看不同权限的用户
    if (currenAuth === 'admin') au = ['user'];

    if (currenAuth === 'super') au = ['admin', 'user'];

    const queryData = {};

    nickname && (queryData.nickname = new RegExp(nickname));

    const skip = pageSize * (current - 1);
    console.log('queryData: ', queryData);
    const queryUser = (auth) =>
      UserModel.find(queryData)
        .where({ isDelete: false, auth })
        .skip(skip)
        .limit(pageSize || null);

    const userList = [];
    // 自定义排序
    for (a of au) {
      let res = [];
      if (auth) {
        if (auth === a) {
          res = await queryUser(a);
          userList.push(...res);
          break;
        }
        continue;
      }
      res = await queryUser(a);
      userList.push(...res);
    }
    const total = userList.length;

    res.status(202).json({
      code: 202,
      message: '获取成功!!',
      data: { userList, total },
    });
  } catch (err) {
    console.log('err: ', err);
    next(err);
  }
};

module.exports = [getUserListValid, getUserList];
