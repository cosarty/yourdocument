const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

module.exports = router;
