const { checkPaperId } = require('./service/paperSvice');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

/**
 *删除试卷
 */
const delPaperValidator = [
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
];

const delPaper = async (req, res, next) => {
  try {
    req.paper.isDelete = true;
    await req.paper.save();
    res.status(200).send({ code: 200, message: '删除成功!!', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '删除失败!!', data: null });
  }
};

module.exports = [delPaperValidator, delPaper];
