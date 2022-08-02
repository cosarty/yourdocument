const express = require('express');
// 数据校验 body 是验证请求体里面的参数
// const { check, body, validationResult } = require('express-validator')

// 获取控制层
const userCtrl = require('../controller/user');

// 验证模块
const userValidator = require('../validator/user');

// 权限拦截
const auth = require('../middleware/authorization');

const router = express.Router();

// 用户登录
router.post('/login', userValidator.login, userCtrl.login);

// 用户注册
router.post('/sign', userValidator.register, userCtrl.register);
// 获取当前登录用户
router.get('/', auth, userCtrl.getCurrenrUser);

// 更新当前用户
router.put('/', auth, userCtrl.updateCurrenrUser);

module.exports = router;
