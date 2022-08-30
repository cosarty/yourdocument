const QuestionsModel = require('../../../model/questionsSchema');

// 检查题目是否合法
exports.checkQutionsId = async (qutionsId) => {
  const question = await QuestionsModel.findById(qutionsId);
  if (!question || question.isDelete) return Promise.reject('题目不存在');
  return question;
};

// 检测用户目前可上传的题目数 同一用户每天只能上传30到题目  返回为0 这是每天的上传题目数为0
exports.checkLimit = async (userId, count = 30) => {
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const limitCount = await QuestionsModel.find()
    .where({ userId, isDelete: false })
    .gte('create_time', yesterday)
    .count();
  if (limitCount <= count) return count - limitCount - 1;
  return -1;
};
