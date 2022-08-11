const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const { difficulty, type, title, tags, detail, params, reference } = require('./questionsValidate');

// 校验参数
const addQuestionValidator = validator([difficulty, type, title, tags, detail, params, reference]);

const addQuestion = async (req, res, next) => {
  try {
    //  TODO 题目限流 以及多选题的 answer应该允许是数组
    const question = await new QuestionsModel({
      ...req.body,
      userId: req.user._id,
      // 管理员添加题目应该自动通过  user admin super
      reviewStatus: req.user.auth !== 'user' ? 2 : 1,
    });
    await question.save();
    await question.populate('userId');
    res.status(200).send({ code: 200, message: '创建成功!!!', data: question });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '保存失败', data: null });
  }
};

module.exports = [addQuestionValidator, addQuestion];
