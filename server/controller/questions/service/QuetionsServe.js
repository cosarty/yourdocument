const QuestionsModel = require('../../../model/questionsSchema');

// 检查题目是否合法
exports.checkQutionsId = async (qutionsId) => {
  const question = await QuestionsModel.findById(qutionsId);
  if (!question || question.isDelete) return Promise.reject('题目不存在');
  return question;
};
