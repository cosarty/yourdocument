const OrganizeModel = require('../../model/organizeSchema');
const validator = require('../../middleware/validator');
const { checkOrganizeId } = require('./service/organizeServe');
const viewPaperValidator = [
  validator([validator.isValidObjectId(['query'], 'organizeId')]),
  async (req, res, next) => {
    const { organizeId } = req.query;
    try {
      const or = await checkOrganizeId(organizeId);

      let isCreate = null;
      if (or.userId.toString() === req.user._id.toString()) isCreate = true;
      if (or.part.find((o) => o?.user?.toString() === req.user._id.toString() && o.pass))
        isCreate = false;

      if (isCreate === null) return next({ code: 403, message: '您没有此组织权限!!!', data: null });

      req.organize = or;
      req.isCreate = isCreate;
      next();
    } catch (error) {
      console.log('error: ', error);
      next({ code: 403, message: error, data: null });
    }
  },
];

const viewPaper = async (req, res, next) => {
  const match = {};
  if (req.isCreate === false) match = { 'papers.publish': true };
  try {
    await req.organize.populate({
      path: 'papers.papersId',
      match,
      select: { questions: 0 },
    });

    res.status(200).send({ code: 200, message: '获取成功!!', data: req.organize.papers });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '获取失败!!', data: null });
  }
};

module.exports = [viewPaperValidator, viewPaper];
