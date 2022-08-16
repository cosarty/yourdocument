const { checkPaperId } = require('./service/paperSvice');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
/**
 *试卷添加和删除题目
 */
const removequtionPaperValidator = [
  validator([validator.isValidObjectId(['params'], 'paperId')]),
  async (req, res, next) => {
    const { paperId } = req.params;
    const id = req.user._id.toString();
    try {
      const paper = await checkPaperId(paperId);
      if (paper.ownership.toString() !== id)
        return next({ code: 403, message: '您没有此试卷的权限', data: null });

      req.paper = paper;
      next();
    } catch (error) {
      return next({ code: 403, message: error, data: null });
    }
  },
  validator([
    body('questions')
      .isArray()
      .withMessage('题目必须是一个数组!!!')
      .bail()
      .notEmpty()
      .withMessage('qustion不能含有空字符串或为空!!!')
      .bail()
      .custom(async (questions, { req }) => {
        const paper = req.paper;
        paper.questions.forEach((question) => {
          if (question.isDelete === false && questions.includes(question.question.toString())) {
            question.isDelete = true;
          }
        });
      })
      .bail(),
  ]),
];

const removequtionPaper = async (req, res, next) => {
  const paper = req.paper;
  await paper.save();

  try {
    res.status(200).send({ code: 200, message: '删除成功!!', data: null });
  } catch {
    next({ code: 500, message: '删除失败!!', data: null });
  }
};

module.exports = [removequtionPaperValidator, removequtionPaper];
