const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');

const { difficulty, title, tags, detail, params, reference } = require('./questionsValidate');

const updateQurstionsValidator = [
  validator([validator.isValidObjectId(['params'], 'qutionsId')]),
  async (req, res, next) => {
    console.log('qutionsId: ', req.params.qutionsId);
    const qutionsId = req.params.qutionsId;

    const question = await QuestionsModel.findById(qutionsId);
    if (!question) return next({ code: 400, message: '文章不存在', data: null });
    // 如果被删除的文章就不能修改
    if (question.isDelete) return next({ code: 400, message: '文章无效', data: null });

    // 普通用户不能修改其他用户的题目  只有管理员可以修改题目
    if (req.user._id !== question.userId.toString() && req.user.auth === 'user')
      return next({ code: 403, message: '您不是文章作者无权修改', data: null });
    req.question = question;
    req.body.type = question.type;
    next();
  },
  // 类型无法修改
  validator([difficulty, title, tags, detail, params, reference]),
];

const updateQuestions = async (req, res, next) => {
  try {
    await req.question.update({ ...req.body });
    res.status(200).send({ code: 202, message: '更新成功!!!', data: null });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '更新失败!!', data: null });
  }
};

module.exports = [updateQurstionsValidator, updateQuestions];
