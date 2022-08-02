const User = require('../model/user');
const { createToken } = require('../util/jwt');
exports.login = async (req, res, next) => {
  try {
    const user = req.user.toJSON();
    delete user.password;
    const token = await createToken({ userId: user._id }, '1h');

    res.status(200).json({
      token,
    });
  } catch (err) {
    next(err);
  }
};

// 用户注册
exports.register = async (req, res, next) => {
  try {
    console.log('req: ', req.body);

    // 验证通过保存到数据库
    let user = new User(req.body);
    await user.save();

    // 去掉密码
    user = user.toJSON();
    delete user['password'];

    // 发送成功响应

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

// 获取当前用户
exports.getCurrenrUser = async (req, res, next) => {
  try {
    res.send('我是用户');
  } catch (err) {
    next(err);
  }
};
exports.updateCurrenrUser = async (req, res, next) => {
  try {
    res.send('我要更新');
  } catch (err) {
    next(err);
  }
};
