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

// 删除题目 -> 发送消息  1、组织的创建者 2、自己上传的题目 3、管理员
router.delete('/delete/:qutionsId', auth(), require('../controller/questions/deleteQuestions'));

// 获取自己上传的题目  reviewStatus 1 2 3
router.post('/search/origin', auth(), require('../controller/questions/searchOriginQuestions'));

// 审核题目 // 管理员审核题目  修改题目状态  -> 发送消息
router.put('/review/:qutionsId', auth(), require('../controller/questions/reviewQuestions'));

// 浏览题目  浏览数加1
router.put(
  '/view/:qutionsId',
  auth(undefined, true),
  require('../controller/questions/viewQuestions'),
);

// 获取自己的浏览记录 获取自己的浏览题目  最多可查看50条浏览记录
router.post('/history', auth(), require('../controller/questions/historyQuestions'));

// 收藏题目  添加 取消 -> 更新收藏列表
router.put('/favour/:qutionsId', auth(), require('../controller/questions/favourQuestion'));

// 获取收藏列表
router.post('/getfavour', auth(), require('../controller/questions/searchfavourQuestions'));

module.exports = router;
