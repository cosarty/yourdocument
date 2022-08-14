const express = require('express');

const router = express.Router();

// 用户路由
router.use('/user', require('./user'));
// 分类路由
router.use('/tags', require('./tags'));
// 题目路由
router.use('/questions', require('./questions'));

// 试卷路由
// 1、下发试卷  -> 下发后的试卷是无法删的
// 2、创建试卷
// 3、删除试卷   -> 删除自己创建的试卷
// 4、 更新试卷
// 5、 开放试卷
// 6、 删除下发的试卷
// 7、 添加题目到试卷

// 成绩接口路由
// 试卷完成接口
// 评分接口
// 成绩接口
// 分数统计接口

// 组织路由
router.use('/organize', require('./organize'));

// 评论路由
// 回复路由
// 上传路由

//TODO 错题本 等前端写的差不多再来写
// 错题本路由// 错题本路由

// 404
// 所有路由定义完之后，最后做404处理 /
router.all('*', (req, res) => {
  res.send('404');
});

module.exports = router;
