const OrganizeModel = require('../../model/organizeSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const editOrganizeValidator = [
  validator([validator.isValidObjectId(['params'], 'organizeId')]),
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
    const { organizeId } = req.params;
    const or = await OrganizeModel.findOne({
      userId: req.user._id,
      isDelete: false,
      _id: organizeId,
    });
    if (!or) return next({ code: 400, message: '组织不存在!!', data: null });
    if (
      await OrganizeModel.findOne({
        userId: req.user._id,
        isDelete: false,
        name,
      })
    ) {
      return next({ code: 400, message: '已存在该名称组织!!', data: null });
    }

    req.organize = or;

    next();
  },
];

const editOrganize = async (req, res, next) => {
  const { name, motto = '' } = req.body;

  try {
    await req.organize.update({ name, motto });
    res.status(202).send({ code: 202, message: '编辑成功!!', data: null });
  } catch {
    next({ code: 500, message: '编辑失败!!', data: null });
  }
};

module.exports = [editOrganizeValidator, editOrganize];
