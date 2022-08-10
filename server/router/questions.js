const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 添加题目
router.post('/addQuestion', auth(), require('../controller/questions/addQuestion'));

// 更新题目
router.put('/updateQuestion/:qutionsId', auth(), require('../controller/questions/updateQuetions'));

// 获取题目
router.get('/search', auth(), require('../controller/questions/searchQuestions'));

module.exports = router;
