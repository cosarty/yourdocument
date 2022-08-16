const { body } = require('express-validator');
const { checkQuestions } = require('./paperSvice');
const PaperModel = require('../../../model/paperSchema');
exports.name = body('name')
  .exists()
  .withMessage('请输入试卷名称')
  .isString()
  .withMessage('试卷名称应该为字符串')
  .bail()
  .custom(async (name, { req }) => {
    const { _id: ownership } = req.user;

    const paper = await PaperModel.findOne({ ownership, name: name.trim() });

    if (paper) return Promise.reject('不能创建名字一样的试卷!!');
  });

exports.detail = body('detail').optional().isString().withMessage('试卷简介应该为字符串类型');
exports.questions = body('questions')
  .isArray()
  .withMessage('题目必须是一个数组!!!')
  .bail()
  .notEmpty()
  .withMessage('qustion不能含有空字符串或为空!!!')
  .bail()
  .custom(async (questions, { req }) => {
    try {
      // 检测类型
      await checkQuestions(questions);
    } catch (error) {
      return Promise.reject(error);
    }
  })
  .bail();

exports.points = body('points')
  .isNumeric()
  .withMessage('分数必须是整数!!!')
  .custom(async (points) => {
    if (points > 200) return Promise.reject('分数最大支持200分');
  });
