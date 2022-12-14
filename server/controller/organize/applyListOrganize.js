const OrganizeModel = require('../../model/organizeSchema');
const mongoose = require('mongoose');
const validator = require('../../middleware/validator');
const applyListValidate = [validator([validator.isValidObjectId(['params'], 'organizeId')])];
// 申请加入组织
const applyListOrganize = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { organizeId } = req.params;
    // 查找没有通过的用户信息
    // 平铺消息
    const applyList = await OrganizeModel.aggregate()

      .match({ userId, _id: mongoose.Types.ObjectId(organizeId) })
      .unwind('part')
      .match({ 'part.pass': false })
      .lookup({ from: 'users', localField: 'part.user', foreignField: '_id', as: 'part' })
      .project({ part: 1 });
    const result = {};
    if (applyList.length > 0) {
      result._id = applyList[0]._id;
      result.part = [];
      for (const ap of applyList) {
        ap.part.map((p) => {
          p.avtar_url = require('config')['site'] + p.avtar_url;
        });
        result.part.push(...ap.part);
      }
    }
    applyList[0].part;
    res.status(200).send({ code: 200, message: '获取成功!!', data: result ?? {} });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '获取失败!!', data: null });
  }
};

module.exports = [applyListValidate, applyListOrganize];
