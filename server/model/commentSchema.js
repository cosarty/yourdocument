const createShcema = require('./util/createShcema');
const { model, Schema } = require('mongoose');
const commentSchema = createShcema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // 用户id
  questionId: { type: Schema.Types.ObjectId, ref: 'Questions', required: true }, // 问题id
  content: { type: String, required: true }, // 回答内容
  priority: { type: Boolean, default: false }, // 采纳
  // thumbNum: String, // 点赞
  isDelete: { type: Boolean, default: false },
});

module.exports = model('Comment', commentSchema);
