const OrganizeModel = require('../../model/organizeSchema');
const addMessage = require('../message/addmessage');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const passOrganizeValidator = [
  validator([
    validator.isValidObjectId(['params'], 'userId'),
    body('organizeId').exists().withMessage('请输入组织号'),
    body('isPass').exists().withMessage('true：通过 false 驳回'),
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
    const { isPass } = req.body;
    const { userId } = req.params;
    const idx = req.organize.part.findIndex((u) => u?.user?.toString() === userId);

    if (isPass) {
      req.organize.part[idx].pass = true;
    } else {
      req.organize.part.splice(idx, 1);
    }

    await req.organize.save();
    if (isPass) {
      await addMessage({
        toUserId: userId,
        title: '组织申请成功!!',
        content: `恭喜加入${req.organize.name}的大家庭`,
        sendEmail: true,
        type: 6,
      });
    }
    res.status(200).send({ code: 200, message: isPass ? '通过成功!!' : '驳回成功!!', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '设置失败!!', data: null });
  }
};

module.exports = [passOrganizeValidator, passOrganize];
