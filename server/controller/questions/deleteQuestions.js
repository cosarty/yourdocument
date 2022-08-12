const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const addMessage = require('../message/addmessage');
const deleteQuestionsValidator = [
  validator([validator.isValidObjectId(['params'], 'qutionsId')]),
  async (req, res, next) => {
    const qutionsId = req.params.qutionsId;
    const question = await QuestionsModel.findById(qutionsId);
    if (!question) return next({ code: 400, message: '题目不存在', data: null });
    if (question.isDelete) return next({ code: 400, message: '题目不存在', data: null });
    req.question = question;
    next();
  },
];

const delteteQuestions = async (req, res, next) => {
  try {
    await req.question.update({ isDelete: true });
    await addMessage({
      toUserId: req.question.userId,
      title: '问题下架!!',
      content: `你的文章存在违规问题！！！【${req.question.title}】`,
      sendEmail: true,
    });
    res.status(200).send({
      code: 202,
      message: '删除成功!!!',
      data: null,
    });
  } catch (error) {
    next({ code: 500, message: '失败', data: null });
  }
};

module.exports = [deleteQuestionsValidator, delteteQuestions];
