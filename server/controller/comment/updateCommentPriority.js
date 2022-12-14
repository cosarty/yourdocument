const CommentModel = require('../../model/commentSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const { checkQutionsId } = require('../questions/service/quetionsServe');
const { priority } = require('./service/commentValidate');
const { content, questionId } = require('./service/commentValidate');
// 校验参数
const updateCommentPriorityValidator = [
  validator([validator.isValidObjectId(['body'], 'commentId'), priority.optional()]),
  validator([
    body('commentId').custom(async (commentId, { req }) => {
      const { _id, auth } = req.user;
      const comment = await CommentModel.findById(commentId);

      try {
        const question = await checkQutionsId(comment.questionId);
        if (!comment || comment.isDelete) return Promise.reject('评论不存在');
        // 仅题目所有者和管理员可操作
        if (!['admin', 'super'].includes(auth) && question.userId.toString() !== _id.toString())
          return Promise.reject('您没有此权限');
        req.comment = comment;
      } catch (error) {
        return Promise.reject('error');
      }
    }),
  ]),
];

const updateCommentPriority = async (req, res, next) => {
  const { priority = false } = req.body;
  try {
    await req.comment.update({ priority });

    res.status(200).send({ code: 202, message: priority ? '采纳成功!!' : '取消采纳', data: null });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '采纳失败!!', data: null });
  }
};

module.exports = [updateCommentPriorityValidator, updateCommentPriority];
