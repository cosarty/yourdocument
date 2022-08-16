const mongoose = require('mongoose');
const { checkQutionsId } = require('../../questions/service/quetionsServe');
const PaperModel = require('../../../model/paperSchema');

// questions参数校验
exports.checkQuestions = async (questions) => {
  if (
    !questions.every(async (q) => {
      const flag = await mongoose.isValidObjectId(q.question);

      const k = Object.keys(q);

      return (
        k.length === 2 &&
        ['question', 'grade'].every((s) => k.includes(s)) &&
        !isNaN(Number(q.grade)) &&
        q.grade < 100 &&
        flag
      );
    })
  ) {
    return Promise.reject('数据类型错误：{ question: String, grade: Number},单题分数最高为100');
  }
  const noexist = [];
  for (let que of questions) {
    try {
      await checkQutionsId(que.question);
    } catch {
      noexist.push(que.question);
    }
  }

  if (noexist.length > 0) {
    return Promise.reject(`以下题目不存在 ${noexist.join(',')}`);
  }
};
// 检查试卷是否合法
exports.checkPaperId = async (paperId) => {
  const paper = await PaperModel.findById(paperId);
  if (!paper || paper.isDelete) return Promise.reject('试卷不存在');
  return paper;
};
