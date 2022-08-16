const { questions } = require('./service/paperValidator');
const { checkPaperId } = require('./service/paperSvice');
const validator = require('../../middleware/validator');

/**
 *试卷添加和删除题目
 */
const addqutionPaperValidator = [
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
    questions.custom(async (questions, { req }) => {
      const paper = req.paper;
      const noexist = [];
      questions.forEach((q) => {
        const exist = paper?.questions.find(
          (p) => p.question.toString() === q.question.toString() && p.isDelete === false,
        );

        if (exist) {
          return;
        }
        noexist.push(q);
      });

      req.noexist = noexist;
    }),
  ]),
];

const addqutionPaper = async (req, res, next) => {
  const paper = req.paper;
  const noexist = req.noexist;
  paper.questions.push(...noexist);
  await paper.save();

  try {
    res.status(200).send({ code: 200, message: '添加成功!!', data: null });
  } catch {
    next({ code: 500, message: '添加失败!!', data: null });
  }
};

module.exports = [addqutionPaperValidator, addqutionPaper];
