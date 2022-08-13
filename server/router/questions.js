const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 添加题目
router.post('/addQuestion', auth(), require('../controller/questions/addQuestion'));

// 更新题目 题目开放还是私有？
router.put('/updateQuestion/:qutionsId', auth(), require('../controller/questions/updateQuetions'));

// 获取题目  首页搜索
router.post('/search', require('../controller/questions/searchQuestions'));

// 获取题目详情
router.get('/get/:qutionsId', require('../controller/questions/getQuestions'));

//TODO 删除题目  --- 遗留bug  自己也可以删除自己的题目
// 删除题目 -> 发送消息  1、组织的创建者 2、自己上传的题目 3、管理员
router.delete(
  '/delete/:qutionsId',
  auth(['super', 'admin']),
  require('../controller/questions/deleteQuestions'),
);

// 获取自己上传的题目  reviewStatus 1 2 3
router.post('/search/origin', auth(), require('../controller/questions/searchOriginQuestions'));

// 审核题目 // 管理员审核题目  修改题目状态  -> 发送消息
router.post('/review/:qutionsId', auth(), require('../controller/questions/reviewQuestions'));

// 浏览题目  浏览数加1
router.post('/view/:qutionsId', require('../controller/questions/viewQuestions'));

// 获取自己的浏览记录 获取自己的浏览题目  最多可查看50条浏览记录
// router.get('/history', auth(), require('../controller/questions/historyQuestions'));
// 收藏题目
router.post('/favour', auth(), require('../controller/questions/searchQuestions'));

// 获取收藏列表
router.post('/getfavour', require('../controller/questions/searchQuestions'));

//TODO 添加题目到组织 或试卷

module.exports = router;
