const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const { checkQutionsId } = require('./service/QuetionsServe');
const getQuestionsValidator = [
  validator([validator.isValidObjectId(['params'], 'qutionsId')]),
  async (req, res, next) => {
    try {
      const question = await checkQutionsId(req.params.qutionsId);
      req.question = question;
      next();
    } catch (err) {
      console.log('err: ', err);
      next({ code: 400, message: err, data: null });
    }
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
