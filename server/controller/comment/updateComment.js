const CommentModel = require('../../model/commentSchema');
const validator = require('../../middleware/validator');
const { content, questionId } = require('./service/commentValidate');
const { checkQutionsId } = require('../questions/service/quetionsServe');
const { body } = require('express-validator');
// 校验参数
const updateCommentValidator = [
  validator([validator.isValidObjectId(['body'], 'commentId')]),
  validator([questionId, content]),
  validator([
    body('commentId').custom(async (commentId, { req }) => {
      const { _id, auth } = req.user;
      console.log('auth: ', auth);
      console.log('[ ', ['admin', 'super'].includes(auth));
      const comment = await CommentModel.findById(commentId);

      if (!comment || comment.isDelete) return Promise.reject('评论不存在');
      console.log('_id: ', _id);
      console.log('req.question.userId: ', req.question.userId);
      console.log('comment.user.toString(): ', comment.user.toString());
      // 仅评论所有者和管理员可操作
      if (
        !['admin', 'super'].includes(auth) &&
        req.question.userId.toString() !== _id.toString() &&
        comment.user.toString() !== _id.toString()
      )
        return Promise.reject('您没有此权限');
      try {
        const question = await checkQutionsId(comment.questionId);
        req.comment = comment;
        req.question = question;
      } catch (error) {
        return Promise.reject(error);
      }
    }),
  ]),
];

// 添加评论
const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    req.comment.content = content;
    await req.comment.save();

    res
      .status(200)
      .send({ code: 200, message: '更新成功!!', data: await req.comment.populate('user') });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '更新成功', data: null });
  }
};

module.exports = [updateCommentValidator, updateComment];
