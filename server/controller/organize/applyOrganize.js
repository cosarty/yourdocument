const OrganizeModel = require('../../model/organizeSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const applyOrganizeValidator = [
  validator([
    body('flag')
      .exists()
      .withMessage('请填写邀请码')
      .isString()
      .isLength({ max: 9, min: 9 })
      .withMessage('邀请码是9位不规则字符'),
  ]),
  async (req, res, next) => {
    const { flag } = req.body;
    const id = req.user._id.toString();
    try {
      const or = await OrganizeModel.findOne({ flag });

      if (!or) return next({ code: 403, message: '没有此组织！！', data: null });
      if (or.userId.toString() === id)
        return next({ code: 403, message: '不能申请加入自己的组织', data: null });
      if (or.part.find((u) => u?.user?.toString() === id))
        return next({ code: 403, message: '不能重复申请', data: null });
      req.organize = or;
      next();
    } catch (error) {
      next({ code: 403, message: error, data: null });
    }
  },
];
// 申请加入组织
const applyOrganize = async (req, res, next) => {
  const { _id: user } = req.user;
  try {
    await req.organize.update({ $push: { part: { user } } });
    res.status(202).send({ code: 202, message: '申请成功!!', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '申请失败!!', data: null });
  }
};

module.exports = [applyOrganizeValidator, applyOrganize];
