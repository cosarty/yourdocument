const { model, Schema } = require('mongoose');
const createShcema = require('./util/createShcema');

const paperSchema = createShcema({
  name: { type: String, require: true }, // 试卷名称
  detail: String, // 试卷详情
  ownership: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // 创建者
  questions: [
    {
      question: Object,
      grade: Number, //分数
    },
  ], // 题目
  points: Number, //总分  这个是给我们预留的 真实的总成绩要统计出来
});

module.exports = model('Paper', paperSchema);
