const QuestionsModel = require('../../model/questionsSchema');
const UserModel = require('../../model/userSchema');
const validator = require('../../middleware/validator');
const { checkQutionsId } = require('./service/QuetionsServe');
const favourQuestionValidator = [
  validator([validator.isValidObjectId(['params'], 'qutionsId')]),
  async (req, res, next) => {
    try {
      const question = await checkQutionsId(req.params.qutionsId);
      req.question = question;
      next();
    } catch (err) {
      console.log('err: ', err);
      next({ code: 400, message: err, data: null });
    }
  },
];

// 更新文章点击数
const updateFavour = async (question, sub) => {
  question.favourNum = question.favourNum + sub;

  question.favourNum < 0 && (question.favourNum = 1);
  await question.save();
};

const favourQuestion = async (req, res, next) => {
  const { qutionsId } = req.params;

  const user = await UserModel.findById(req.user._id);
  !user.favours && (user.favours = []);
  // 判断用户是否收藏的此题目
  const isFavour = user.favours.includes(qutionsId);
  // 更新用户收藏列表
  user.favours[isFavour ? 'pop' : 'push'](qutionsId);
  // 更新收藏数
  await updateFavour(req.question, isFavour ? -1 : 1);
  await user.save();
  try {
    res.status(200).send({
      code: 202,
      message: isFavour ? '取消成功!!!' : '收藏成功!!!',
      data: user,
    });
  } catch (error) {
    next({ code: 500, message: '失败', data: null });
  }
};

module.exports = [favourQuestionValidator, favourQuestion];
