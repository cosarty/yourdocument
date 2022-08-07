const mongoose = require('mongoose');

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
      // select: false,
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
    organize: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organize' }], // 加入的组织
    auth: {
      //  user admin super
      type: String,
      default: 'user',
      required: true,
    },
    create_time: { type: Date, default: Date.now },
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: 'update_time',
    },
  },
);

module.exports = mongoose.model('User', userSchema);
