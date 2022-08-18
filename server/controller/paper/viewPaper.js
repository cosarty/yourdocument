const { checkPaperId } = require('./service/paperSvice');
const validator = require('../../middleware/validator');
const { query } = require('express-validator');
const { name, detail, points } = require('./service/paperValidator');
const PaperModel = require('../../model/paperSchema');
const mongoose = require('mongoose');
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
    // 坑 aggregate的match搜索id的时候必须先转换
    const paper = await PaperModel.aggregate()
      .match({ _id: mongoose.Types.ObjectId(req.query.paperId) })
      .unwind('questions')
      .match({ 'questions.isDelete': false })
      .group({
        _id: {
          id: '$_id',
          ownership: '$ownership',
          detail: '$detail',
          points: '$points',
          name: '$name',
        },
        questions: { $addToSet: '$questions' },
      })
      .lookup({
        from: 'users',
        foreignField: '_id',
        localField: '_id.ownership',
        as: 'ownership',
      })
      .unwind('ownership')
      .project({
        _id: 0,
        paperInfo: {
          paperId: '$_id.id',
          detail: '$_id.detail',
          name: '$_id.name',
          points: '$_id.points、',
        },
        'ownership.nickname': 1,
        'questions.question': 1,
        'questions.grade': 1,
      });
    res.status(200).send({
      code: 200,
      message: '查看成功!!',
      data: paper,
    });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '查看成功!!', data: null });
  }
};

module.exports = [viewPaperValidator, viewPaper];
