const express = require('express');
const router = express.Router();

const auth = require('../middleware/authorization');

// 更新消息状态  可以删除可以查看
router.put('/update', auth(), require('../controller/message/updateMessage'));

// 更新所有 只能更改查看状态
router.put('/updateAll', auth(), require('../controller/message/updateAllMessage'));

// 查看消息  搜索消息  目前只支持已读未读
router.post('/search', auth(), require('../controller/message/searchMessage'));

// 查看未读的数量 计数一下就好

router.post('/count', auth(), require('../controller/paper/createPaper'));

module.exports = router;
