const { checkPaperId } = require('./service/paperSvice');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

/**
 *更新试卷信息
 */
const updateCoreValidator = [
  validator([validator.isValidObjectId(['params'], 'paperId')]),
  validator([
    validator.isValidObjectId(['body'], 'question'),
    body('grade')
      .isNumeric()
      .withMessage('分数只能是数字')
      .custom(async (grade) => {
        if (grade > 100) return Promise.reject('单题分数不能大于100');
      }),
  ]),

  async (req, res, next) => {
    const { paperId } = req.params;
    const { question } = req.body;
    const id = req.user._id.toString();
    try {
      const paper = await checkPaperId(paperId);
      if (paper.ownership.toString() !== id)
        return next({ code: 403, message: '您没有此试卷的权限', data: null });
      if (!paper.questions.find((p) => p.question.toString() === question && p.isDelete === false))
        return next({ code: 403, message: '题目不存在', data: null });

      req.paper = paper;

      next();
    } catch (error) {
      return next({ code: 403, message: error, data: null });
    }
  },
];

const updateCore = async (req, res, next) => {
  const { question, grade } = req.body;

  const q = req.paper.questions.find(
    (p) => p.question.toString() === question && p.isDelete === false,
  );
  q.grade = grade;
  try {
    await req.paper.save();
    res.status(200).send({ code: 200, message: '更新成功!!', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '更新失败!!', data: null });
  }
};

module.exports = [updateCoreValidator, updateCore];
