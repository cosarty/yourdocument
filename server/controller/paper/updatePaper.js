const { checkPaperId } = require('./service/paperSvice');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const { name, detail, points } = require('./service/paperValidator');

/**
 *更新试卷信息
 */
const updatePaperValidator = [
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
  validator([name.optional(), detail, points.optional()]),
];

const updatePaper = async (req, res, next) => {
  const paper = req.paper;
  const { name, detail, points, questions = [] } = req.body;
  const conf = {};

  name && (conf.name = name);
  detail && (conf.detail = detail);
  points && (conf.points = points);
  Array.isArray(questions) && (conf.questions = questions);

  try {
    await paper.update(conf);
    res.status(200).send({ code: 200, message: '更新成功!!', data: null });
  } catch {
    next({ code: 500, message: '更新失败!!', data: null });
  }
};

module.exports = [updatePaperValidator, updatePaper];
