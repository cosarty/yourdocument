const OrganizeModel = require('../../model/organizeSchema');
const randomString = require('random-string');
const validator = require('../../middleware/validator');
const { checkOrganizeId } = require('./service/organizeServe');
const usersOrganizeValidator = [
  validator([validator.isValidObjectId(['params'], 'organizeId')]),
  async (req, res, next) => {
    const { organizeId } = req.params;
    try {
      const or = await checkOrganizeId(organizeId);

      if (or.userId.toString() !== req.user._id.toString())
        return next({ code: 403, message: '您没有权限', data: null });
      console.log('or: ', or);
      if (or.isDelete) return next({ code: 403, message: '组织不存在!!!', data: null });

      req.organize = or;
      next();
    } catch (error) {
      next({ code: 403, message: error, data: null });
    }
  },
];

const usersOrganize = async (req, res, next) => {
  try {
    await req.organize.populate({ path: 'part.user', select: { nickname: 1 } });
    users = req.organize.part.filter((u) => u.pass);
    console.log('users: ', users);
    res.status(200).send({ code: 200, message: '获取成功!!', data: users });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '获取失败!!', data: null });
  }
};

module.exports = [usersOrganizeValidator, usersOrganize];
