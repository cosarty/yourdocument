const TagsModel = require('../../model/tagsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const addTagsValidator = [
  validator([
    body('name')
      .exists()
      .withMessage('请输入分类名称!!')
      .bail()
      .custom(async (name, { req }) => {
        const tag = await TagsModel.findOne({ name });

        if (tag && !req.body.tags) return Promise.reject('模块已存在！！');

        if (tag) {
          req.tag = tag;
          return;
        }

        // 如果不存在就创建

        try {
          const tag = await new TagsModel({ name, tags: [] });
          req.tag = tag;
        } catch {
          return Promise.reject('创建失败!!');
        }
      }),
    body('tags')
      .isArray()
      .optional()
      .custom(async (tags, { req }) => {
        const existTag = [];
        await Promise.all(
          tags.map(async (tag) => {
            // 判断此分类下的tag是否已经存在
            const i = await TagsModel.findOne({ tags: tag });
            if (i) existTag.push(tag);
          }),
        );
        if (existTag.length > 0) return Promise.reject(`${existTag.join(',')}标签已存在！！`);
      }),
  ]),
];

const addTags = async (req, res) => {
  const { name, tags = [] } = req.body;

  try {
    if (tags.length > 0) {
      req.tag.tags.push(...tags);
    }

    await req.tag.save();
    res.status(202).send({ code: 202, message: '更新成功!!', data: null });
  } catch (err) {
    console.log(err);
    res.status(500).send({ code: 500, message: '更新失败!!', data: null });
  }
};

module.exports = [addTagsValidator, addTags];
