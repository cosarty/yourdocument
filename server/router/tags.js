const express = require('express');

// 权限拦截
const auth = require('../middleware/authorization');

const router = express.Router();

router.get('/getTags', require('../controller/tags/getTags'));
router.put('/addTags', auth('super'), require('../controller/tags/addTags'));

module.exports = router;
