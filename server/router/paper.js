const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 1、下发试卷  -> 下发后的试卷题目是无法删的
// 2、创建试卷
router.post('/create', auth(), require('../controller/paper/createPaper'));

// 3、删除试卷   -> 删除自己创建的试卷
// 4、 更新试卷
// 5、 开放试卷
// 6、 删除下发的试卷
// 7、 添加题目到试卷

module.exports = router;
