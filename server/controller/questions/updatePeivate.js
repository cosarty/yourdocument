const { checkQutionsId } = require('./service/quetionsServe');
const validator = require('../../middleware/validator');

const updateQurstionsValidator = [
  validator([validator.isValidObjectId(['params'], 'qutionsId')]),
  async (req, res, next) => {
    const qutionsId = req.params.qutionsId;
    try {
      const question = await checkQutionsId(qutionsId);
      if (
        req.user._id.toString() !== question.userId.toString() &&
        !['admin', 'super'].includes(req.user.auth)
      )
        return next({ code: 403, message: '您不是文章作者无权修改', data: null });
      req.question = question;
    } catch (error) {
      return next({ code: 403, message: error, data: null });
    }
    next();
  },
];

const updatePeivate = async (req, res, next) => {
  try {
    req.question.isPrivate = !req.question.isPrivate;
    await req.question.save();
    res
      .status(202)
      .send({ code: 202, message: '设置成功!!!', data: { isPrivate: req.question.isPrivate } });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '设置失败!!', data: null });
  }
};

module.exports = [updateQurstionsValidator, updatePeivate];
