const User = require('../model/user');
const AuthCode = require('../model/authCode ');
const { createToken } = require('../util/jwt');
const randomString = require('random-string');
const senMail = require('../common/sendMail');

exports.login = async (req, res, next) => {
  try {
    const user = req.user.toJSON();
    delete user.password;
    const token = await createToken({ userId: user._id });

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

exports.sendMail = async (req, res, next) => {
  const { email } = req.body;
  let captcha;
  // 查找验证码是否存在
  while (true) {
    captcha = randomString({ length: 6 }).toLowerCase();
    const codeInfo = await AuthCode.findOne({ captcha });
    // 如果验证码不存在或者有有效期过了就跳出去
    if (!codeInfo || codeInfo.expireTime < new Date().getTime()) break;
  }

  const d = await senMail({
    to: '414359193@qq.com',
    subject: '试题君',
    content: '欢迎注册试题君。验证码：' + captcha,
  });

  if (!d) {
    next({ code: 401, message: '邮件发送失败', data: null });
    return;
  }
  try {
    await new AuthCode({ expireTime: new Date(), captcha, email });
    res.status(200).json({ code: 200, message: '邮件发送成功！', data: null });
  } catch {
    console.log('保存失败');
  }

  //
};
