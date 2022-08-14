const TagsModel = require('../../model/tagsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const { checkUser } = require('../user/server/userServe');
const createOrganizeValidator = [
  validator([
    body('name')
      .exists()
      .withMessage('请输入组织名称！！')
      .isString()
      .withMessage('名称应该为字符串！！！'),
    body('motto').optional().isString().withMessage('简介应为字符串类型数据！！'),
  ]),
];

const createOrganize = async (req, res, next) => {
  const { name, tags } = req.body;
  console.log(1);
  try {
    res.status(202).send({ code: 202, message: '删除成功!!', data: null });
  } catch {
    next({ code: 500, message: '删除失败!!', data: null });
  }
};

module.exports = [createOrganizeValidator, createOrganize];
