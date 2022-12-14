const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const { tags, difficulty } = require('./service/questionsValidate');
// title  tags[]   type  difficulty  最新 最多收藏  -> pageSize  pageNum
// orderKey  用来指定排序  update_time  favourNum
const searchQuestionsValidator = validator([
  body('title').optional().isString().withMessage('title是字符串类型!!!'),
  tags.optional(),
  body('type')
    .optional()
    .bail()
    .isIn(['0', '1', '2', '3'])
    .withMessage('题目类型如下 0:判断题 1:单选题 2: 多选题 3.简答题 '),
  difficulty,
  body('orderKey')
    .isString()
    .withMessage('orderKey必须是字符串')
    .bail()
    .isIn(['create_time', 'favourNum'])
    .withMessage('目前只支持时间和收藏量的排序'),
  body('order').optional().isInt().withMessage('排序规则是-1 和 1').toInt(),
  body('pageSize').optional().isInt().withMessage('页面大小必须是整型的').toInt(),
  body('pageNum').optional().isInt().withMessage('页数必须是整型的').toInt(),
]);
const searchQuestions = async (req, res, next) => {
  const queryData = { isPrivate: { $in: [true, undefined] } };
  const {
    title,
    tags,
    type,
    difficulty,
    orderKey,
    order = -1,
    pageSize = 20,
    pageNum = 1,
  } = req.body;

  title && (queryData.title = new RegExp(title));
  tags && tags.length > 0 && (queryData.tags = tags);
  type && (queryData.type = type);
  !Number.isNaN(Number(difficulty)) && (queryData.difficulty = difficulty);
  const skip = pageSize * (pageNum - 1);
  // 技巧 获取数量
  const queryQuestion = () =>
    QuestionsModel.find()
      .populate({ path: 'userId', select: { nickname: 1 } })
      .where({ ...queryData, reviewStatus: 2, isDelete: false })
      .skip(skip)
      .limit(pageSize || null);
  // 搜索
  const questionslist = await queryQuestion().sort({ [orderKey]: order });
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

module.exports = [searchQuestionsValidator, searchQuestions];
