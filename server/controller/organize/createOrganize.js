const OrganizeModel = require('../../model/organizeSchema');
const randomString = require('random-string');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const createOrganizeValidator = [
  validator([
    body('name')
      .exists()
      .withMessage('请输入组织名称！！')
      .isString()
      .withMessage('名称应该为字符串！！！'),

    body('motto').optional().isString().withMessage('简介应为字符串类型数据！！'),
  ]),
  async (req, res, next) => {
    const { name } = req.body;
    const { _id } = req.user;
    const or = await OrganizeModel.findOne({ name, userId: _id });
    console.log('or: ', or);
    if (or) return next({ code: 403, message: '不能创建名字一样的组织!!', data: null });

    next();
  },
];

const createOrganize = async (req, res, next) => {
  const { name, motto = '' } = req.body;
  const { _id: userId } = req.user;

  try {
    const count = await OrganizeModel.find({ userId, isDelete: false }).count();
    if (count >= 5) return next({ code: 403, message: '每个用户最多创建5个组织!!', data: null });
    // 创建邀请码
    let flag;
    while (true) {
      flag = randomString({ length: 9 });
      const or = await OrganizeModel.findOne({ flag });
      if (!or) break;
    }
    const organize = await new OrganizeModel({ userId, name, motto, flag });
    await organize.save();
    res.status(202).send({ code: 202, message: '创建成功!!', data: null });
  } catch {
    next({ code: 500, message: '创建失败!!', data: null });
  }
};

module.exports = [createOrganizeValidator, createOrganize];
