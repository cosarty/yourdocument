const CommentModel = require('../../model/commentSchema');
const validator = require('../../middleware/validator');
const { param } = require('express-validator');
const { checkQutionsId } = require('../questions/service/quetionsServe');
// 校验参数
const deleteCommentValidator = [
  validator([validator.isValidObjectId(['params'], 'commentId')]),
  validator([
    param('commentId').custom(async (commentId, { req }) => {
      const { _id, auth } = req.user;
      const comment = await CommentModel.findById(commentId);
      console.log('comment: ', comment);

      if (!comment || comment.isDelete) return Promise.reject('评论不存在');
      // 仅评论所有者和管理员可操作
      if (!['admin', 'super'].includes(auth) || comment.user.toString() !== _id.toString())
        return Promise.reject('您没有此权限');
      const question = await checkQutionsId(comment.questionId);
      req.comment = comment;
      req.question = question;
    }),
  ]),
];

// 删除评论
const deleteComment = async (req, res, next) => {
  try {
    await req.comment.update({ isDelete: true });
    // 评论减一
    req.question.commentNum -= 1;
    await req.question.save();
    res.status(200).send({ code: 202, message: '删除成功!!', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '删除失败', data: null });
  }
};

module.exports = [deleteCommentValidator, deleteComment];
