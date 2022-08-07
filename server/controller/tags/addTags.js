const TagsModel = require('../../model/tagsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const addTagsValidator = [
  validator([
    body('name')
      .exists()
      .withMessage('请输入分类名称!!')
      .bail()
      .custom(async (name) => {
        const tag = await TagsModel.findOne({ name });
        if (tag) return Promise.resolve();
        // 如果不存在就创建
        try {
          (await new TagsModel({ name, tags: [] })).save();
        } catch {
          return Promise.reject('创建失败!!');
        }
      }),
    body('tags')
      .isArray()
      .withMessage('tags必须是一个数组!!!')
      .bail()
      .notEmpty()
      .withMessage('tag不能含有空字符串!!!'),
  ]),
  validator([
    body('tags').custom(async (tags, { req }) => {
      console.log(req.body);
      const existTag = [];
      await Promise.all(
        tags.map(async (tag) => {
          // 判断此分类下的tag是否已经存在
          const i = await TagsModel.findOne({ name: req.body.name, tags: tag });
          if (i) existTag.push(tag);
        }),
      );
      if (existTag.length > 0) return Promise.reject(`${existTag.join(',')}标签已存在！！`);
    }),
  ]),
];

const addTags = async (req, res) => {
  const { name, tags } = req.body;
  try {
    const tagModel = await TagsModel.findOne({ name });
    tagModel.tags.push(...tags);
    console.log(tagModel.tags);
    await tagModel.save();
    res.status(202).send({ code: 202, message: '更新成功!!', data: null });
  } catch {
    res.status(500).send({ code: 500, message: '更新失败!!', data: null });
  }
};

module.exports = [addTagsValidator, addTags];
