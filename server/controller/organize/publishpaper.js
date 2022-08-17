const validator = require('../../middleware/validator');
const { checkOrganizeId } = require('./service/organizeServe');
const publishpaperValidator = [
  validator([validator.isValidObjectId(['params'], 'organizeId')]),
  validator([validator.isValidObjectId(['body'], 'paperId')]),
  async (req, res, next) => {
    const { organizeId } = req.params;
    const { paperId } = req.body;
    try {
      const or = await checkOrganizeId(organizeId);

      if (
        or.userId.toString() !== req.user._id.toString() ||
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

const publishpaper = async (req, res, next) => {
  const { paperId } = req.body;
  const paper = req.organize.papers.find((p) => p.papersId.toString() === paperId);
  const { publish = false } = paper;
  const tip = !publish ? '开放' : '关闭';
  try {
    paper.publish = !publish;

    await req.organize.save();

    res.status(200).send({ code: 200, message: tip + '成功!!', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: tip + '失败!!', data: null });
  }
};

module.exports = [publishpaperValidator, publishpaper];
