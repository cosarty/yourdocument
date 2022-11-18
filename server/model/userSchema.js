const { model, Schema } = require('mongoose');
const createShcema = require('./util/createShcema');
const md5 = require('../util/md5');

const userSchema = createShcema({
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: (value) => md5(value),
    // 查询的时候不输出password
    // select: false,
  },
  gender: {
    type: Number,
    required: true,
  },
  avtar_url: {
    type: String,
    default: null,
    get: (url) => {
      console.log(url ? require('config')['site'] + url : '');
      return url ? require('config')['site'] + url : '';
    },
  },
  is_ban: {
    type: Boolean,
    default: false,
  },
  profile: {
    type: String,
    default: null,
  },
  auth: {
    //  user admin super
    type: String,
    default: 'user',
    required: true,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  favours: [{ type: Schema.Types.ObjectId, ref: 'Questions' }], //收藏夹
});

// 坑 必须这样子设置 get函数才能生效
userSchema.set('toJSON', { getters: true });

module.exports = model('User', userSchema);
