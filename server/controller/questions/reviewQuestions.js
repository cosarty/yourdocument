const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const addMessage = require('../message/addmessage');
const { checkQutionsId } = require('./service/QuetionsServe');
const reviewQuestionsValidator = [
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

const reviewQuestions = async (req, res, next) => {
  try {
    // await req.question.update({ isDelete: true });
    // await addMessage({
    //   toUserId: req.question.userId,
    //   title: '问题下架!!',
    //   content: `你的文章存在违规问题！！！【${req.question.title}】`,
    //   sendEmail: true,
    // });
    res.status(200).send({
      code: 202,
      message: '成功!!!',
      data: null,
    });
  } catch (error) {
    next({ code: 500, message: '失败', data: null });
  }
};

module.exports = [reviewQuestionsValidator, reviewQuestions];
