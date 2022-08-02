const express = require('express');
const profileCtrl = require('../controller/profile');
const router = express.Router();

// 获取用户资料
router.get('/:username', profileCtrl.getUserProFile);

// 关注用户
router.post('/:username/follow', profileCtrl.setUserFollow);

// 取消关注
router.delete('/:username/follow', profileCtrl.cancelUserFollow);

module.exports = router;
