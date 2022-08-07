const { verifyToken } = require('../util/jwt');

/**
 *
 * @param {*} auth  权限用户
 * @returns
 */
module.exports = (auth) => async (req, res, next) => {
  // 获取token数据
  let token = req.headers['authorization'];

  token = token ? token.split('Bearer ')[1] : null;

  if (!token) res.status(401).send({ code: 401, messgae: '请先登录!!', data: null });
  try {
    const data = await verifyToken(token);
    if (auth && data.user.auth !== auth)
      res.status(403).send({ code: 401, messgae: '您不具备次权限!!!', data: null });
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ msg: error.message });
  }
};
