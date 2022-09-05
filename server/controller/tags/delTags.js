const TagsModel = require('../../model/tagsSchema');
const QuestionModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const checkTags = async (tags) => {
  const noiTag = [];
  await Promise.all(
    tags.map(async (t) => {
      const q = await QuestionModel.find({ tags: t });
      if (q.length > 0) noiTag.push(t);
    }),
  );

  if (noiTag.length > 0)
    return Promise.reject('这些标签下面挂载题目无法删除(' + noiTag.join(',') + ')');
};

const delTagsValidator = [
  validator([
    body('name').custom(async (name, { req }) => {
      const tag = await TagsModel.findOne({ name });
      if (!tag) return Promise.reject('分类不存在!!!');
      try {
        await checkTags(tag.tags);

        // 如果不存在就创建
        req.tags = tag;
      } catch (error) {
        console.log('error: ', error);
        return Promise.reject(error);
      }
    }),
    body('tags')
      .optional()
      .isArray()
      .withMessage('tags必须是一个数组!!!')
      .bail()
      .notEmpty()
      .withMessage('tags不能含有空字符串或为空!!!')
      .custom(async (tags) => {
        try {
          await checkTags(tags);
        } catch (error) {
          return Promise.reject(error);
        }
      }),
  ]),
];

const delTags = async (req, res, next) => {
  const { name, tags } = req.body;
  console.log(1);
  try {
    if (!tags || tags.length === 0) {
      await TagsModel.remove({ name });
    } else {
      // 过滤删除的tag
      req.tags.tags = req.tags.tags.filter((i) => !tags.includes(i));
      await req.tags.save();
    }

    res.status(202).send({ code: 202, message: '删除成功!!', data: null });
  } catch {
    next({ code: 500, message: '删除失败!!', data: null });
  }
};

module.exports = [delTagsValidator, delTags];
