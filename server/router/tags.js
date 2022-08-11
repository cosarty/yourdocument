const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 获取分类
router.get('/getTags', require('../controller/tags/getTags'));
// 添加分类
router.put('/addTags', auth('super'), require('../controller/tags/addTags'));
// 删除分类
router.delete('/delTags', auth('super'), require('../controller/tags/delTags'));

module.exports = router;
