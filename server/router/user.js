const express = require('express');

// 权限拦截
const auth = require('../middleware/authorization');

const router = express.Router();

// 用户登录
router.post('/login', require('../controller/user/login/login'));

// 发送邮件
router.post('/sendmail', require('../controller/user/register/sendMail'));

// 用户注册
router.post('/sign', require('../controller/user/register/register'));
// 获取当前登录用户
router.get('/', auth, require('../controller/user/login/getCurrent'));

// // 更新当前用户
// router.put('/', auth, updateCurrenrUser);

module.exports = router;
