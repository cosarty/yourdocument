const createShcema = require('./util/createShcema');
const { model, Schema } = require('mongoose');
const messageSchema = createShcema({
  content: { type: String, required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isDelete: { type: Boolean, default: false },
  status: { type: Number, default: 0 }, // 0 未读  1 已读
  title: { type: String, required: true },
  isMail: { type: Boolean, required: false }, // 是否发送邮件通知
});

module.exports = model('Message', messageSchema);
