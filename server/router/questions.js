const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 添加题目
router.post('/addQuestion', auth(), require('../controller/questions/addQuestion'));

// 更新题目
router.put('/updateQuestion/:qutionsId', auth(), require('../controller/questions/updateQuetions'));

// 获取题目
router.post('/search', require('../controller/questions/searchQuestions'));

// 获取自己上传的题目

// 删除题目 -> 发送消息  1、组织的创建者 2、自己上传的题目 3、管理员

// 管理员审核题目  修改题目状态  -> 发送消息

// 收藏题目

// 添加题目到组织 或试卷

module.exports = router;
