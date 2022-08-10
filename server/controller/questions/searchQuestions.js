const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const validateType = require('../../util/validateType');
const { body } = require('express-validator');
const { tags, difficulty } = require('./checkBody');
// title  tags[]   type  difficulty  最新 最多收藏  -> pageSize  pageNum
// orderKey  用来指定排序  update_time  favourNum
const searchQuestionsValidator = validator([
  body('title').optional().isString().withMessage('title是字符串类型!!!'),
  tags,
  body('type')
    .optional()
    .bail()
    .isIn(['0', '1', '2', '3'])
    .withMessage('题目类型如下 0:判断题 1:单选题 2: 多选题 3.简答题 '),
  difficulty,
  body('orderKey')
    .isString()
    .withMessage('必须是字符串')
    .bail()
    .isIn(['update_time', 'favourNum'])
    .withMessage('目前只支持时间和收藏量的排序'),
  body('order').default(1),
]);
const searchQuestions = async (req, res, next) => {
  try {
    res.status(200).send({ code: 200, message: '创建成功!!!', data: '成功' });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '保存失败', data: null });
  }
};

module.exports = [searchQuestionsValidator, searchQuestions];
