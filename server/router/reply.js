const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

router.post('/add', auth(), require('../controller/reply/addReply'));
router.delete('/delete/:replyId', auth(), require('../controller/comment/deleteComment'));

router.get('/search', auth(), require('../controller/comment/getComment'));

module.exports = router;
