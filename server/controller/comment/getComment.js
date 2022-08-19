const CommentModel = require('../../model/commentSchema');
const validator = require('../../middleware/validator');
const { query } = require('express-validator');
const { checkQutionsId } = require('../questions/service/quetionsServe');
// 校验参数
const getCommentValidator = [
  validator([validator.isValidObjectId(['query'], 'commentId')]),
  validator([
    query('commentId').custom(async (commentId, { req }) => {
      const { _id, auth } = req.user;
      const comment = await CommentModel.findById(commentId).populate({
        path: 'user',
        select: { nickname: 1 },
      });
      console.log('comment: ', comment);

      if (!comment || comment.isget) return Promise.reject('评论不存在');
      // 仅评论所有者和管理员可操作
      if (!['admin', 'super'].includes(auth) || comment.user._id.toString() !== _id.toString())
        return Promise.reject('您没有此权限');
      try {
        await checkQutionsId(comment.questionId);
        req.comment = comment;
      } catch (error) {
        return Promise.reject(error);
      }
    }),
  ]),
];

// 获取评论
const getComment = async (req, res, next) => {
  try {
    res.status(200).send({ code: 200, message: '获取成功!!', data: req.comment });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '获取失败', data: null });
  }
};

module.exports = [getCommentValidator, getComment];
