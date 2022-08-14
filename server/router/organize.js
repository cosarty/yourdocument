const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 创建组织

router.post('/create', auth(), require('../controller/organize/createOrganize'));
// 删除组织  只有创建者可以删除组织
router.delete('/del/:organizeId', auth(), require('../controller/organize/deleteOrganize'));
// 申请加入组织  自己不能加入自己的组织

router.post('/apply', auth(), require('../controller/organize/applyOrganize'));

// 通过组织
router.put('/pass/:userId', auth(), require('../controller/organize/passOrganize'));

// 申请列表
router.get('/applyList', auth(), require('../controller/organize/applyListOrganize'));
// 获取组织详情

// 设置组织昵称

// 驳回 组织  发送消息
// 获取自己的组织列表
// 获取自己加入组织列表

// 踢出组织

module.exports = router;
