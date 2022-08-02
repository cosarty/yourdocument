const mongoose = require('mongoose');
const baseModel = require('./baseModel');

const md5 = require('../util/md5');

const userSchema = new mongoose.Schema({
  username: {
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
    select: false,
  },
  bio: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  ...baseModel,
});

module.exports = mongoose.model('User', userSchema);
