const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const { difficulty, tags } = require('./service/questionsValidate');
const searchOriginQuestionsValidator = validator([
  body('type')
    .optional()
    .bail()
    .isIn(['0', '1', '2', '3'])
    .withMessage('题目类型如下 0:判断题 1:单选题 2: 多选题 3.简答题 '),
  body('pageSize').optional().isInt().withMessage('页面大小必须是整型的').toInt(),
  body('pageNum').optional().isInt().withMessage('页数必须是整型的').toInt(),
  body('reviewStatus')
    .optional()
    .isString()
    .withMessage('审核状态只能是1,2,3')
    .isIn(['1', '2', '3'])
    .withMessage('审核状态只能是1,2,3')
    .toInt(),
  difficulty,
  tags.optional(),
]);

/**
 * 获取自己上传的题目
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const searchOriginQuestions = async (req, res, next) => {
  const queryData = {};
  const { type, pageSize, reviewStatus, pageNum, difficulty, tags } = req.body;
  const skip = pageSize * (pageNum - 1);

  type && (queryData.type = type);
  reviewStatus && (queryData.reviewStatus = reviewStatus);
  difficulty && (queryData.difficulty = difficulty);
  tags && tags.length > 0 && (queryData.tags = tags);
  // 技巧 获取数量
  const queryQuestion = () =>
    QuestionsModel.find()
      .populate('userId')
      .where({ ...queryData, isDelete: false, userId: req.user._id });

  // 搜索
  const questionslist = await queryQuestion()
    .skip(skip)
    .limit(pageSize || null)
    .sort({ create_time: -1 });
  const total = await queryQuestion().count();
  try {
    res.status(200).send({
      code: 200,
      message: '搜索成功!!!',
      data: { list: questionslist, total },
    });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '搜索失败', data: null });
  }
};

module.exports = [searchOriginQuestionsValidator, searchOriginQuestions];
