const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const {
  difficulty,
  type,
  title,
  tags,
  detail,
  params,
  reference,
} = require('./service/questionsValidate');
const { checkLimit } = require('./service/quetionsServe');

// 校验参数
const addQuestionValidator = validator([difficulty, type, title, tags, detail, params, reference]);

const addQuestion = async (req, res, next) => {
  try {
    // 题目限流
    const limit = await checkLimit(req.user._id);
    if (limit === -1) {
      return next({ code: 403, message: '今日题目已上限！！！', data: null });
    }
    const question = await new QuestionsModel({
      ...req.body,
      userId: req.user._id,
      // 管理员添加题目应该自动通过  user admin super
      reviewStatus: req.user.auth !== 'user' ? 2 : 1,
    });
    await question.save();
    await question.populate('userId');
    res.status(200).send({ code: 202, message: `今日剩余可上传数${limit}`, data: null });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '保存失败', data: null });
  }
};

module.exports = [addQuestionValidator, addQuestion];
