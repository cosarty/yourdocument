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
router.get('/getCurrent', auth(), require('../controller/user/login/getCurrentUser'));

// 更新当前用户
router.put('/updateCurrent', auth(), require('../controller/user/login/updateCurrenrUser'));

// 设置权限
router.put('/setPermission', auth(['super']), require('../controller/user/setPermission'));

// 删除用户   ->错题本   admin -> 只能ban 普通用户   super可以ban所有用户
router.put('/ban', auth(['super', 'admin']), require('../controller/user/banUser'));

// 获取用户列表  获取ban的用户和没有ban的用户
router.get('/getUserList', auth(['super', 'admin']), require('../controller/user/getUserList'));

module.exports = router;
