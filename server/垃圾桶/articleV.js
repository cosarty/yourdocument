const { body } = require('express-validator');
const validate = require('../middleware/validator');
const article = require('../model/article');
const Article = require('../model/article');

exports.createArticle = validate([
  body('title').notEmpty().withMessage('文章标题不能为空'),
  body('description').notEmpty().withMessage('文章摘要不能为空'),
  body('body').notEmpty().withMessage('文章内容不能为空'),
]);

exports.getArticle = validate([
  // 校验id
  validate.isValidObjectId(['params'], 'articleId'),
]);

exports.updateArticle = [
  validate([validate.isValidObjectId(['params'], 'articleId')]),
  async (req, res, next) => {
    const articleId = req.params.articleId;
    const article = await Article.findById(articleId);
    if (!article) {
      res.status(404);
      next({ msg: '文章不存在!!' });
      return;
    }
    // 看作者是否正确

    if (req.userId !== article.author.toString()) {
      res.status(403);
      next({ msg: '你不是文章作者,无权修改!!!' });
    }

    req.article = article;

    next();
  },
];
exports.removeArticle = [
  validate([validate.isValidObjectId(['params'], 'articleId')]),
  async (req, res, next) => {
    const articleId = req.params.articleId;
    const article = await Article.findById(articleId);
    if (!article) {
      res.status(404);
      next({ msg: '文章不存在!!' });
      return;
    }
    // 看作者是否正确

    if (req.userId !== article.author.toString()) {
      res.status(403);
      next({ msg: '你不是文章作者,无权删除!!!' });
    }

    req.article = article;
    next();
  },
];
