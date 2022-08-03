const { verifyToken } = require('../util/jwt');

module.exports = async (req, res, next) => {
  // 获取token数据
  let token = req.headers['authorization'];

  token = token ? token.split('Bearer ')[1] : null;

  if (!token) res.status(401).send({ code: 401, messgae: '请先登录!!', data: null });
  try {
    const data = await verifyToken(token);
    req.userId = data.userId;
    next();
  } catch (error) {
    res.status(401).send({ msg: error.message });
  }
};
