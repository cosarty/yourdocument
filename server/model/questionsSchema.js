const { model, Schema } = require('mongoose');
const createShcema = require('./util/createShcema');
const questionsSchema = createShcema({
  difficulty: {
    type: Number, // 0 简单 1 中等 2 困难
    default: 0,
  },
  title: { type: String, required: true }, // title不能超过80
  commentNum: {
    type: Number,
    default: 0,
  }, // 评论数
  detail: {
    type: String,
  },
  favourNum: {
    type: Number,
    default: 0,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  params: {
    answer: {
      type: String,
    },
    options: {
      A: { type: String },
      B: { type: String },
      C: { type: String },
      D: { type: String },
      E: { type: String },
      F: { type: String },
      G: { type: String },
    },
  },
  reference: {
    type: String, // 简答题答案
  },
  type: {
    type: Number, //题目类型 0 1 2 3
    required: true,
  },
  reviewStatus: { type: Number, default: 1 }, // 审核状态 1 待审核 2 审核通过  3 驳回
  reviewTime: Date,
  reviewMessage: String, // 审核消息
  reviewId: { type: Schema.Types.ObjectId, ref: 'User' }, // 审核人
  tags: [{ type: String, required: true }], // 标签
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // 题目发起人
  viewNum: { type: Number, default: 0 }, // 阅读人数
  isPrivate: { type: Boolean, required: true },
});

module.exports = model('Questions', questionsSchema);
