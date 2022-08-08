const QuestionsModel = require('../../model/questionsSchema');
const TagsModel = require('../../model/tagsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const addQuestionValidator = validator([
  body('difficulty')
    .optional()
    .isIn(['0', '1', '2'])
    .withMessage('题目难度如下 0:简单 1:中等 2: 困难 ')
    .toInt(),
  body('type')
    .isIn(['0', '1', '2'])
    .withMessage('题目类型如下 0:判断题 1:单选题 2: 多选题 3.简答题 ')
    .toInt(),
  body('title')
    .isString()
    .withMessage('标题只允许字符串!!!')
    .bail()
    .isLength({ mix: 5, max: 80 })
    .withMessage('标题长度只允许5-80个字符!!!!'),
  body('detail').optional().isString().withMessage('题目解析只能是字符串!!!'),
  body('tags')
    .isArray()
    .withMessage('tags必须是一个数组!!!')
    .bail()
    .notEmpty()
    .withMessage('tag不能含有空字符串或为空!!!')
    .custom(async (tags) => {
      const noexistTag = [];
      await Promise.all(
        tags.map(async (tag) => {
          // 判断此分类下的tag是否已经存在
          const i = await TagsModel.findOne({ tags: tag });
          if (!i) noexistTag.push(tag);
        }),
      );
      if (noexistTag.length > 0) return Promise.reject(`${noexistTag.join(',')}标签不存在!!`);
    }),
  ,
  body('params')
    .optional()
    .isJSON()
    .withMessage('选项必须是对象类型')
    .bail()
    .custom(async (params, { req }) => {
      if (!['0', '1', '2'].includes(req.type)) return Promise.reject('题型填写错误！！');
    }),
  body('reference')
    .optional()
    .isString()
    .withMessage('简答题的答案为字符串类型!!!')
    .bail()
    .custom(async (reference, { req }) => {
      if (req.type !== '3') return Promise.reject('题型填写错误！！');
    }),
]);

const addQuestion = async (req, res) => {
  res.status(200).send(req.body);
};

module.exports = [addQuestionValidator, addQuestion];
