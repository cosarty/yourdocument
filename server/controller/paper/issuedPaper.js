const { checkPaperId } = require('./service/paperSvice');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const { name, detail, points } = require('./service/paperValidator');
const { checkOrganizeId } = require('../organize/service/organizeServe');
/**
 *下发试卷
 */
const issuedPaperValidator = [
  validator([validator.isValidObjectId(['params'], 'paperId')]),
  validator([validator.isValidObjectId(['body'], 'organizeId')]),
  async (req, res, next) => {
    const { paperId } = req.params;
    const { organizeId } = req.body;
    const id = req.user._id.toString();
    try {
      const or = await checkOrganizeId(organizeId);
      if (or.userId.toString() !== req.user._id.toString())
        return next({ code: 403, message: '您没有此组织的权限', data: null });
      const paper = await checkPaperId(paperId);
      if (paper.ownership.toString() !== id)
        return next({ code: 403, message: '您没有此试卷的权限', data: null });
      if (or.papers.find((o) => o.papersId.toString() === paperId))
        return next({ code: 403, message: '试卷已经下发', data: null });
      req.paper = paper;
      req.or = or;
      next();
    } catch (error) {
      return next({ code: 403, message: error, data: null });
    }
  },
  validator([name.optional(), detail, points.optional()]),
];

const issuedPaper = async (req, res, next) => {
  const { paperId } = req.params;
  const or = req.or;
  try {
    or.papers.push({ papersId: paperId });
    await or.save();
    res.status(200).send({ code: 200, message: '下发成功!!', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '下发失败!!', data: null });
  }
};

module.exports = [issuedPaperValidator, issuedPaper];
