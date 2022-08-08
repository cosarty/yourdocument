const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

router.get('/getTags', require('../controller/tags/getTags'));
router.put('/addTags', auth('super'), require('../controller/tags/addTags'));
router.delete('/delTags', auth('super'), require('../controller/tags/delTags'));

module.exports = router;
