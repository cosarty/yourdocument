exports.getUserProFile = async (req, res, next) => {
  try {
    res.send('用户名');
  } catch (err) {
    next(err);
  }
};
exports.setUserFollow = async (req, res, next) => {
  try {
    res.send('关注');
  } catch (err) {
    next(err);
  }
};
exports.cancelUserFollow = async (req, res, next) => {
  try {
    res.send('取消关注');
  } catch (err) {
    next(err);
  }
};
