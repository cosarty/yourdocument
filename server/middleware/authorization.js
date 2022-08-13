const { verifyToken } = require('../util/jwt');

/**
 *
 * @param {*} auth  权限用户  vi 如果为true的话则可登录可不登录
 * @returns
 */
module.exports = (auth, vi) => async (req, res, next) => {
  // 获取token数据
  let token = req.headers['authorization'];

  token = token ? token.split('Bearer ')[1] : null;

  if (!token && !vi) {
    res.status(401).send({ code: 401, messgae: '请先登录!!', data: null });
    return;
  }
  try {
    if (token) {
      const data = await verifyToken(token);
      if (Array.isArray(auth) && !auth.includes(data.user.auth)) {
        res.status(403).send({ code: 403, messgae: '您不具备此权限!!!', data: null });
        return;
      }
      req.user = data.user;
    }
    next();
  } catch (error) {
    res.status(401).send({ msg: error.message });
  }
};
