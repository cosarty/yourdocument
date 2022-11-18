const OrganizeModel = require('../../model/organizeSchema');

const validator = require('../../middleware/validator');
const { checkOrganizeId } = require('./service/organizeServe');
const { default: mongoose } = require('mongoose');
const getPaperValidator = [
  validator([validator.isValidObjectId(['query'], 'organizeId')]),
  validator([validator.isValidObjectId(['query'], 'paperId')]),
  async (req, res, next) => {
    const { organizeId, paperId } = req.query;
    try {
      const or = await checkOrganizeId(organizeId);

      if (
        or.userId.toString() !== req.user._id.toString() &&
        !or.papers.find((p) => p.papersId.toString() === paperId)
      )
        return next({ code: 403, message: '您没有权限', data: null });
      req.organize = or;
      next();
    } catch (error) {
      next({ code: 403, message: error, data: null });
    }
  },
];

const getPaper = async (req, res, next) => {
  const { organizeId, paperId } = req.query;
  try {
    const paperInfo = await OrganizeModel.aggregate()
      .match({
        _id: mongoose.Types.ObjectId(organizeId),
        papers: {
          $elemMatch: {
            papersId: mongoose.Types.ObjectId(paperId),
          },
        },
      })
      .lookup({
        from: 'paper',
        localField: 'papers.papersId',
        foreignField: '_id',
        as: 'paper',
      })
      .project({ paper: 1 })
      .lookup({
        from: 'questions',
        localField: 'paper.questions.question',
        foreignField: '_id',
        as: 'questionInfo',
      })
      .lookup({
        from: 'users',
        localField: 'paper.ownership',
        foreignField: '_id',
        as: 'ownership',
      })
      .project({
        _id: 0,
        'paper.ownership': 0,
        ownership: 0,
      })
      .unwind('paper');

    res.status(200).send({ code: 200, message: '获取成功!!', data: paperInfo[0] });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '获取失败!!', data: null });
  }
};

module.exports = [getPaperValidator, getPaper];
