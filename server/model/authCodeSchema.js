const createShcema = require('./util/createShcema');
const { model } = require('mongoose');
const authCodeSchema = createShcema({
  expireTime: {
    type: Date,
    get(val) {
      return new Date(val).getTime();
    },
    set(val) {
      return new Date(new Date(val).getTime() + 5 * 60 * 1000); // 验证码的有效时间为五分钟
    },
  },
  captcha: {
    type: String,
    required: true,
  },
  type: String,
  email: {
    type: String,
    required: true,
  },
});

module.exports = model('AuthCode', authCodeSchema);
