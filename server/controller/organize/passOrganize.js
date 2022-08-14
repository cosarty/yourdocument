const OrganizeModel = require('../../model/organizeSchema');

const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const passOrganizeValidator = [
  validator([
    validator.isValidObjectId(['params'], 'userId'),
    body('organizeId').exists().withMessage('请输入组织号'),
  ]),

  async (req, res, next) => {
    const { userId } = req.params;
    const { organizeId } = req.body;
    const id = userId.toString();
    try {
      const or = await OrganizeModel.findOne({ 'part.user': userId, _id: organizeId });
      if (!or) return next({ code: 403, message: '此用户没有申请组织', data: null });
      const isUser = or.part.find((u) => u.user.toString() === id);
      if (isUser && isUser.pass === true)
        return next({ code: 403, message: '此用户已经是组织成员了!!!!', data: null });
      req.organize = or;
      next();
    } catch (error) {
      next({ code: 403, message: error, data: null });
    }
  },
];
// 申请加入组织
const passOrganize = async (req, res, next) => {
  try {
    req.organize.part[0].pass = true;

    await req.organize.save();

    res.status(202).send({ code: 202, message: '设置成功!!', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '设置失败!!', data: null });
  }
};

module.exports = [passOrganizeValidator, passOrganize];
