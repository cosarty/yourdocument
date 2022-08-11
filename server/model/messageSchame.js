const createShcema = require('./util/createShcema');
const { model } = require('mongoose');
const messageSchema = createShcema({
  content: { type: String, require: true },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  isDelete: { type: Boolean, default: false },
  status: { type: Number, default: 0 }, // 0 未读  1 已读
  title: { type: String, require: true },
  isMail: { type: Boolean, default: false }, // 是否发送邮件通知
});

module.exports = model('Message', messageSchema);
