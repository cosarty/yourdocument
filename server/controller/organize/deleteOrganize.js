const OrganizeModel = require('../../model/organizeSchema');

const validator = require('../../middleware/validator');
const { checkOrganizeId } = require('./service/organizeServe');
const deleteOrganizeValidator = [
  validator([validator.isValidObjectId(['params'], 'organizeId')]),
  async (req, res, next) => {
    const { organizeId } = req.params;
    try {
      const or = await checkOrganizeId(organizeId);

      if (or.userId.toString() !== req.user._id.toString())
        return next({ code: 403, message: '您没有权限', data: null });
      req.organize = or;
      next();
    } catch (error) {
      next({ code: 403, message: error, data: null });
    }
  },
];

const deleteOrganize = async (req, res, next) => {
  try {
    await req.organize.update({ isDelete: true });
    res.status(202).send({ code: 202, message: '删除成功!!', data: null });
  } catch {
    next({ code: 500, message: '删除失败!!', data: null });
  }
};

module.exports = [deleteOrganizeValidator, deleteOrganize];
