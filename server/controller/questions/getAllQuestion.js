const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const { tags, difficulty } = require('./service/questionsValidate');
// title  tags[]   type  difficulty  最新 最多收藏  -> pageSize  pageNum
// orderKey  用来指定排序  update_time  favourNum
const getAllQuestionValidator = validator([
  body('title').optional().isString().withMessage('title是字符串类型!!!'),
  tags.optional(),
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
]);
const getAllQuestion = async (req, res, next) => {
  const queryData = {};
  const { title, tags, type, reviewStatus, pageSize = 20, pageNum = 1 } = req.body;

  title && (queryData.title = new RegExp(title));
  tags && tags.length > 0 && (queryData.tags = tags);
  type && (queryData.type = type);

  reviewStatus && (queryData.reviewStatus = reviewStatus);
  const skip = pageSize * (pageNum - 1);
  // 技巧 获取数量
  const queryQuestion = () =>
    QuestionsModel.find()
      .populate({ path: 'userId', select: { nickname: 1 } })
      .where({ ...queryData, isDelete: false })
      .skip(skip)
      .limit(pageSize || null);
  // 搜索
  const questionslist = await queryQuestion();
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

module.exports = [getAllQuestionValidator, getAllQuestion];
