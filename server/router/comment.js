const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

router.post('/add', auth(), require('../controller/comment/addComment'));
router.delete('/delete/:commentId', auth(), require('../controller/comment/deleteComment'));
router.get('/get', auth(), require('../controller/comment/getComment'));
router.post('/update/priority', auth(), require('../controller/comment/addComment'));

//TODO 搜索题目
router.post('/search', auth(), require('../controller/comment/addComment'));

module.exports = router;
