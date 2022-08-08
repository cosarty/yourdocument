const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 添加题目
router.put('/addQuestion', auth(), require('../controller/questions/addQuestion'));

module.exports = router;
