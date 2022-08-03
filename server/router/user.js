const express = require('express');

// 获取控制层
const { login, register, getCurrenrUser, updateCurrenrUser } = require('../controller/user');

// 验证模块
const { loginValid, registerValid } = require('../validator/userVa');

// 权限拦截
const auth = require('../middleware/authorization');

const router = express.Router();

// 用户登录
router.post('/login', loginValid, login);

// 发送邮件
router.post('/sendmail', sendMailValid, sendMail);

// 用户注册
router.post('/sign', registerValid, register);
// 获取当前登录用户
router.get('/', auth, getCurrenrUser);

// 更新当前用户
router.put('/', auth, updateCurrenrUser);

module.exports = router;