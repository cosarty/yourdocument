const express = require('express');
const router = express.Router();
// 权限拦截
const auth = require('../middleware/authorization');

// 创建试卷
router.post('/create', auth(), require('../controller/paper/createPaper'));

//  添加题目
router.put('/addqution/:paperId', auth(), require('../controller/paper/addqutionPaper'));

// 删除题目
router.delete('/removeqution/:paperId', auth(), require('../controller/paper/removequtionPaper'));

// 更新试卷 ->更新简介和标题和总成绩
router.put('/update/:paperId', auth(), require('../controller/paper/updatePaper'));

// 下发试卷  -> 下发后的试卷题目是无法删的  下发到自己创建的组织  删除下发的试卷 要把成绩一起删除掉不能忘记 要不然出大事情
router.put('/issued/:paperId', auth(), require('../controller/paper/issuedPaper'));

//   查看试卷详情  只能获取没有被删除的题目哦
router.get('/view', auth(), require('../controller/paper/viewPaper'));

// 修改题目分数
router.put('/updateCore/:paperId', auth(), require('../controller/paper/updateCore'));

// 删除试卷   -> 删除自己创建的试卷
router.delete('/del/:paperId', auth(), require('../controller/paper/delPaper'));

// 获取我创建的试卷信息
router.get('/get/myPaper', auth(), require('../controller/paper/getMyPaper'));

module.exports = router;
