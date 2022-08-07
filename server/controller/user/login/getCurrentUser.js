// 获取当前用户
const getCurrenrUser = async (req, res, next) => {
  try {
    res.status(200).send({ ...req.user });
  } catch (err) {
    next(err);
  }
};

module.exports = [getCurrenrUser];
