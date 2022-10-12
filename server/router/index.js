const express = require('express');

const router = express.Router();

// 用户路由
router.use('/user', require('./user'));
// 分类路由
router.use('/tags', require('./tags'));
// 题目路由
router.use('/questions', require('./questions'));

// 试卷路由
router.use('/paper', require('./paper'));

// 成绩接口路由
// 试卷完成接口
// 评分接口
// 成绩接口
// 分数统计接口

// 组织路由
router.use('/organize', require('./organize'));

// 消息路由

router.use('/message', require('./message'));

// 评论路由
router.use('/comment', require('./comment'));

// 回复路由
router.use('/reply', require('./reply'));

// 上传路由
router.use('/upload', require('./upload'));

// 404
// 所有路由定义完之后，最后做404处理 /
router.all('*', (req, res) => {
  res.send('404');
});

module.exports = router;
