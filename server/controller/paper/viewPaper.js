const { checkPaperId } = require('./service/paperSvice');
const validator = require('../../middleware/validator');
const { query } = require('express-validator');
const { name, detail, points } = require('./service/paperValidator');
/**
 *查看试卷详情
 */
const viewPaperValidator = [
  validator([
    query('paperId').exists().notEmpty().withMessage('请输入试卷id'),
    validator.isValidObjectId(['query'], 'paperId'),
  ]),
  async (req, res, next) => {
    const { paperId } = req.query;
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

const viewPaper = async (req, res, next) => {
  try {
    res.status(200).send({
      code: 200,
      message: '查看成功!!',
      data: await req.paper.populate({ path: 'ownership', select: { nickname: 1 } }),
    });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '查看成功!!', data: null });
  }
};

module.exports = [viewPaperValidator, viewPaper];
