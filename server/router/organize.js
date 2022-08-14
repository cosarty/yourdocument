const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 创建组织

router.post('/create', auth(), require('../controller/organize/createOrganize'));
// 删除组织
// 邀请加入组织  不能邀请自己  ----先不做  后面看看
// 踢出组织
// 查看组织人员
// 设置组织昵称
// 查看组织信息
// 申请加入组织  自己不能加入自己的组织
// 通过组织
// 驳回 组织
// 搜索组织列表
// 申请列表

module.exports = router;
