// 获取当前用户
const getCurrenrUser = async (req, res, next) => {
  try {
    res.status(200).send({ code: 200, message: '获取成功', data: req.user });
  } catch (err) {
    next({ code: 403, message: '获取失败', data: req.user });
  }
};

module.exports = [getCurrenrUser];
