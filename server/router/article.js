const express = require('express');
const router = express.Router();

const article = require('../controller/article');

const auth = require('../middleware/authorization');

const articleValidate = require('../validator/article');

// 获取文章列表
router.get('/articles', article.getArticles);

// 获取文章
router.get('/:articleId', articleValidate.getArticle, article.getArticle);

// 创建文章
router.post('/', auth, articleValidate.createArticle, article.createArticle);

// 更新文章
router.put('/:articleId', auth, articleValidate.updateArticle, article.updateArticle);

// 删除文章
router.delete('/:articleId', auth, articleValidate.removeArticle, article.removeArticle);

module.exports = router;
