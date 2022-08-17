const OrganizeModel = require('../../model/organizeSchema');

const validator = require('../../middleware/validator');
const { checkOrganizeId } = require('./service/organizeServe');

const kickoutOrganizeValidator = [
  validator([
    validator.isValidObjectId(['params'], 'organizeId'),
    validator.isValidObjectId(['body'], 'userId'),
  ]),
  async (req, res, next) => {
    const { organizeId } = req.params;
    const { userId } = req.body;
    try {
      const or = await checkOrganizeId(organizeId);

      if (or.userId.toString() !== req.user._id.toString())
        return next({ code: 403, message: '您没有权限', data: null });
      if (!or.part.find((u) => u?.user?.toString() === userId))
        return next({ code: 403, message: '用户不存在!!!', data: null });
      req.organize = or;
      next();
    } catch (error) {
      next({ code: 403, message: error, data: null });
    }
  },
];

const kickoutOrganize = async (req, res, next) => {
  try {
    const { userId } = req.body;
    req.organize.part = req.organize.part.filter((u) => u?.user?.toString() !== userId);
    await req.organize.save();
    res.status(202).send({ code: 202, message: '移除成功!!', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '移除失败!!', data: null });
  }
};

module.exports = [kickoutOrganizeValidator, kickoutOrganize];
