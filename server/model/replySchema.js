const createShcema = require('./util/createShcema');
const { model, Schema } = require('mongoose');
const replySchema = createShcema({
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }, // 评论id  一级评论
  content: { type: String, required: true }, // 评论内容
  isDelete: {
    type: Boolean,
    default: false,
  }, // 是否删除
  replyId: { type: Schema.Types.ObjectId, ref: 'Reply' }, // 多级评论
  replyUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Questions', required: true }, // 问题id
});

module.exports = model('Reply', replySchema);
