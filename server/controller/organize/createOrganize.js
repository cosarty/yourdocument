const TagsModel = require('../../model/tagsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const createOrganizeValidator = [
  validator([
    body('name').custom(async (name, { req }) => {
      const tag = await TagsModel.findOne({ name });
      if (!tag) return Promise.reject('分类不存在!!!');
      // 如果不存在就创建
      req.tags = tag;
    }),
    body('tags')
      .optional()
      .isArray()
      .withMessage('tags必须是一个数组!!!')
      .bail()
      .notEmpty()
      .withMessage('tag不能含有空字符串或为空!!!'),
  ]),
];

const createOrganize = async (req, res, next) => {
  const { name, tags } = req.body;
  console.log(1);
  try {
    res.status(202).send({ code: 202, message: '删除成功!!', data: null });
  } catch {
    next({ code: 500, message: '删除失败!!', data: null });
  }
};

module.exports = [createOrganizeValidator, createOrganize];
