const validator = require('../../../middleware/validator');
const { body } = require('express-validator');
// 获取模型
const User = require('../../../model/userSchema');
const AuthCode = require('../../../model/authCodeSchema');

const randomString = require('random-string');
const senMail = require('../../../util/sendMail');

const sendMailValid = validator([
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为空！！')
    .bail()
    .isEmail()
    .withMessage('请输入合法邮箱')
    .bail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) return Promise.reject('用户已注册!!!');
    }),
]);

// 发送验证码的逻辑
const sendMail = async (req, res, next) => {
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
    to: email,
    subject: '试题君',
    content: '欢迎注册试题君。验证码：' + captcha,
  });
  if (!d) {
    next({ code: 401, message: '邮件发送失败', data: null });
    return;
  }
  try {
    const authcode = new AuthCode({ expireTime: new Date(), captcha, email });
    await authcode.save();
    res.status(200).json({ code: 200, message: '邮件发送成功！', data: { captcha } });
  } catch (err) {
    next({ code: 401, message: '邮件发送失败', data: null });
  }
};

module.exports = [sendMailValid, sendMail];
