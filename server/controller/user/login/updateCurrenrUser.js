const userModel = require('../../../model/userSchema');
const validator = require('../../../middleware/validator');
const { body } = require('express-validator');

const updateUserValidator = validator([
  body('nickname')
    .optional()
    .isString()
    .withMessage('请输入字符串类型!!!')
    .bail()
    .notEmpty()
    .withMessage('不能输入空字符串'),
  body('gender')
    .isInt()
    .withMessage('请输入数字类型数据')
    .bail()
    .custom(async (gender, { req }) => {
      if (![0, 1].includes(Number(gender))) return Promise.reject('0:女生,1:男生!!');
    })
    .bail()
    .toInt(),
  body('profile').isString().withMessage('请输入字符串类型!!').optional(),
]);

const updateCurrenrUser = async (req, res, next) => {
  try {
    // 更新用户
    console.log('req.body: ', req.body);
    console.log('req.user._id,: ', req.user._id);
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.status(202).send({ code: 200, message: '更新成功', data: null });
  } catch (err) {
    next({ code: 400, message: '更新失败', data: null });
  }
};

module.exports = [updateUserValidator, updateCurrenrUser];
