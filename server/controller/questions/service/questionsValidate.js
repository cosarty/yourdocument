const TagsModel = require('../../../model/tagsSchema');
const validateType = require('../../../util/validateType');
const { body } = require('express-validator');

exports.difficulty = body('difficulty')
  .optional()
  .isIn(['0', '1', '2'])
  .withMessage('题目难度如下 0:简单 1:中等 2: 困难 ')
  .toInt();
exports.type = body('type')
  .exists()
  .withMessage('请输入类型')
  .bail()
  .isIn(['0', '1', '2', '3'])
  .withMessage('题目类型如下 0:判断题 1:单选题 2: 多选题 3.简答题 ')
  .custom(async (type, { req }) => {
    if (['0', '1', '2'].includes(type) && !req.body?.params) return Promise.reject('请填写选项');
    if (type === '3' && !req.body?.reference) return Promise.reject('请填写答案解析');
  })
  .toInt();
exports.title = body('title')
  .exists()
  .withMessage('请输入题目！！')
  .bail()
  .isString()
  .withMessage('标题只允许字符串!!!')
  .bail();
// .isLength({ mix: 5, max: 80 })
// .withMessage('标题长度只允许5-80个字符!!!!');
exports.detail = body('detail').optional().isString().withMessage('题目解析只能是字符串!!!');
exports.tags = body('tags')
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
  });
exports.params = body('params')
  .optional()
  .isObject()
  .withMessage('选项必须是对象类型')
  .bail()
  .custom(async (params, { req }) => {
    if (!['0', '1', '2'].includes(req.body.type + '')) return Promise.reject('题型填写错误！！');
    if (!params?.answer || !params?.options) return Promise.reject('请输入正确答案或选项');
    if (validateType(params?.answer) !== 'string' || validateType(params?.options) !== 'object')
      return Promise.reject('选项类型为 answer:string, options:{}');
    const opKey = Object.keys(params?.options);
    if (opKey.length < 2 || opKey.some((i) => !['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(i)))
      return Promise.reject('选项至少2个,选项标题只能是ABCDEFG');
  });
exports.reference = body('reference')
  .optional()
  .isString()
  .withMessage('答案为字符串类型!!!')
  .bail()
  .custom(async (reference, { req }) => {
    if (req.body.type != '3') return Promise.reject('答案填写错误！！');
  });
