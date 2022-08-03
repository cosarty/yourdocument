const mongoose = require('mongoose');
const baseModel = require('./baseModel');

const md5 = require('../util/md5');

const userSchema = new mongoose.Schema(
  {
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
      select: false,
    },
    gender: {
      type: Number,
      required: true,
    },
    avtar_url: {
      type: String,
      default: null,
    },
    is_ban: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
      default: null,
    },
    ...baseModel,
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
