const CommentModel = require('../../model/commentSchema');
const validator = require('../../middleware/validator');
const { query } = require('express-validator');
const { checkQutionsId } = require('../questions/service/quetionsServe');
const { getquestionId } = require('./service/commentValidate');
// 校验参数
const getCommentValidator = [
  validator([validator.isValidObjectId(['query'], 'questionId')]),
  validator([getquestionId]),
  validator([
    query('questionId').custom(async (questionId, { req }) => {
      // const { _id, auth } = req.user;
      const comment = await CommentModel.find({ questionId, isDelete: false })
        .where('user')
        .populate({
          path: 'user',
          select: { nickname: 1 },
        });

      if (!comment || comment.isget) return Promise.reject('评论不存在');
      // 仅评论所有者和管理员可操作
      // if (!['admin', 'super'].includes(auth) || comment.user._id.toString() !== _id.toString())
      //   return Promise.reject('您没有此权限');

      req.comment = comment;
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
