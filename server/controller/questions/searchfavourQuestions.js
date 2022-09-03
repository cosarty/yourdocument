const { getUserInfo } = require('../user/server/userServe');
const validator = require('../../middleware/validator');
const { tags } = require('./service/questionsValidate');
const searchfavourQuestionsValidator = [validator([tags.optional()])];

const searchfavourQuestions = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { tags } = req.body;
    const userInfo = await getUserInfo(_id);
    const userFavour = await userInfo.populate({
      path: 'favours',
      match: Object.assign({ isDelete: false }, tags ? { tags } : {}),
    });
    res.status(200).send({ code: 200, message: '获取成功', data: userFavour['favours'] });
  } catch (err) {
    next({ code: 500, message: '获取失败', data: null });
  }
};

module.exports = [searchfavourQuestionsValidator, searchfavourQuestions];
