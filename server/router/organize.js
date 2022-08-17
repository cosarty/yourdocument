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

// 通过组织   -> 驳回 组织  发送消息
// TODO 发送邮箱通知
router.put('/pass/:userId', auth(), require('../controller/organize/passOrganize'));

// 申请列表
router.get('/applyList', auth(), require('../controller/organize/applyListOrganize'));
// 获取组织人员
router.get('/users/:organizeId', auth(), require('../controller/organize/usersOrganize'));

//TODO 组织昵称 写前端的时候在搞
// 设置组织昵称

//TODO 组织名称 写前端的时候在搞
// 设置组织名称

// 获取自己创建组织列表
router.get('/self', auth(), require('../controller/organize/selfOrganize'));

// 获取自己加入的组织列表
router.get('/get', auth(), require('../controller/organize/getOrganize'));
// 踢出组织  要把成绩一起删掉  设置成isDelete
router.put('/kickout/:organizeId', auth(), require('../controller/organize/kickoutOrganize'));

// 查看组织试卷列表  组织成员查看开发试卷
router.get('/viewPaper', auth(), require('../controller/organize/viewPaper'));

//TODO 查看下发试卷详情   删除的也可以看  只能创建者查看  获取试卷内的题目
router.get('/getPaper', auth(), require('../controller/organize/getPaper'));

// TODO 开放试卷

module.exports = router;
