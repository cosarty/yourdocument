const mongose = require('mongoose');
const baseModel = require('./baseModel');

const authCodeSchema = new mongose.Schema({
  expireTime: {
    type: Date,
    default: Date.now,
    get(val) {
      return new Date(val).getTime();
    },
    set(val) {
      return new Date().setTime(Date.now * 5 * 60 * 1000); // 验证码的有效时间为五分钟
    },
  },
  captcha: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongose.model('AuthCode', authCodeSchema);
