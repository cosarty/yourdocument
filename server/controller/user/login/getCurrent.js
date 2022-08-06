// 获取当前用户
const getCurrenrUser = async (req, res, next) => {
  try {
    res.send('我是用户');
  } catch (err) {
    next(err);
  }
};

module.exports = [getCurrenrUser];
