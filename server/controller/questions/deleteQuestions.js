const UserModel = require('../../model/userSchema');
const validator = require('../../middleware/validator');
const addMessage = require('../message/addmessage');
const { checkQutionsId } = require('./service/quetionsServe');
const deleteQuestionsValidator = [
  validator([validator.isValidObjectId(['params'], 'qutionsId')]),
  async (req, res, next) => {
    try {
      const question = await checkQutionsId(req.params.qutionsId);
      if (question.isDelete) return next({ code: 400, message: '文章不存在', data: null });
      if (
        req.user._id.toString() !== question.userId.toString() &&
        !['admin', 'super'].includes(req.user.auth)
      )
        return next({ code: 403, message: '您不是文章作者无权修改', data: null });
      req.question = question;
      next();
    } catch (err) {
      console.log('err: ', err);
      next({ code: 400, message: err, data: null });
    }
  },
];

const delteteQuestions = async (req, res, next) => {
  try {
    // 删除此题目的收藏记录
    await UserModel.updateMany(
      { _id: req.question.userId },
      { $pull: { favours: req.question._id } },
    );

    // 这边到时候要加一个删除原因
    await req.question.update({ isDelete: true });
    await addMessage({
      toUserId: req.question.userId,
      title: '问题下架!!',
      content: `你的文章存在违规问题！！！【${req.question.title}】`,
      sendEmail: true,
      type: 1,
    });
    res.status(200).send({
      code: 202,
      message: '删除成功!!!',
      data: null,
    });
  } catch (error) {
    next({ code: 500, message: '失败', data: null });
  }
};

module.exports = [deleteQuestionsValidator, delteteQuestions];
