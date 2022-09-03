const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

router.post('/add', auth(), require('../controller/comment/addComment'));
router.delete('/delete', auth(), require('../controller/comment/deleteComment'));
router.get('/get', require('../controller/comment/getComment'));
router.put('/update', auth(), require('../controller/comment/updateComment'));
router.post('/update/priority', auth(), require('../controller/comment/updateCommentPriority'));

// 获取自己的评论
router.get('/search', auth(), require('../controller/comment/searchComment'));

module.exports = router;
