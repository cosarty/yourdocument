const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const getQuestionsValidator = [
  validator([validator.isValidObjectId(['params'], 'qutionsId')]),
  async (req, res, next) => {
    console.log('qutionsId: ', req.params.qutionsId);
    const qutionsId = req.params.qutionsId;
    const question = await QuestionsModel.findById(qutionsId);
    if (!question) return next({ code: 400, message: '题目不存在', data: null });
    req.question = question;
    next();
  },
];

const getQuestions = async (req, res, next) => {
  try {
    res.status(200).send({
      code: 200,
      message: '获取成功!!!',
      data: await req.question.populate('userId'),
    });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '失败', data: null });
  }
};

module.exports = [getQuestionsValidator, getQuestions];
