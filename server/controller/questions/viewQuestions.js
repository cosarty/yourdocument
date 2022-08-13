const validator = require('../../middleware/validator');
const { checkQutionsId } = require('./service/QuetionsServe');
const { getClientIp } = require('../../util/getClientIP');
const historyModel = require('../../model/historySchema');
/**
 * 浏览题目
 */
const viewQuestionsValidator = [
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

const viewQuestions = async (req, res, next) => {
  const { _id: questionId } = req.question;
  const ip = getClientIp(req);
  // 同一个用户浏览同一个问题的时候不能累加
  const isHistory = await historyModel
    .findOne({ questionId })
    .or([{ userId: req.user?._id }, { ip }]);
  if (isHistory) {
    next({ code: 202, message: '重复浏览！！', data: null });
  }
  if (req.user) {
    const hi = await new historyModel({ questionId, userId });
    await hi.save();
  } else {
    const hi = await new historyModel({ questionId, ip });
    await hi.save();
  }
  req.question.viewNum = req.question.viewNum + 1;
  // 更新浏览记录
  await req.question.save();
  try {
    // await req.question.update({ reviewMessage, reviewStatus });

    res.status(200).send({
      code: 202,
      message: '浏览成功!!!',
      data: {
        title: req.question.title,
        viewNum: req.question.viewNum,
      },
    });
  } catch (error) {
    next({ code: 500, message: '失败', data: null });
  }
};

module.exports = [viewQuestionsValidator, viewQuestions];
