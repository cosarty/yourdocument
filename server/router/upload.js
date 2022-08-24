const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 上传图片
router.post('/avatar', auth(), require('../controller/upload/uploadImage'));

module.exports = router;
