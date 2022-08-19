const { checkQutionsId } = require('../../questions/service/quetionsServe');
const { checkCommentId } = require('../../comment/service/commentServe');
const { checkReplyId } = require('./ReplyuServe');
const { body } = require('express-validator');
const xss = require('xss');

// content, questionId, commentId, replyId, replyUserId

exports.questionId = body('questionId').custom(async (questionId, { req }) => {
  try {
    const q = await checkQutionsId(questionId);
    req.question = q;
  } catch (err) {
    return Promise.reject(err);
  }
});
exports.commentId = body('commentId')
  .optional()
  .custom(async (commentId, { req }) => {
    try {
      const c = await checkCommentId(commentId);
      req.comment = c;
    } catch (err) {
      return Promise.reject(err);
    }
  });
exports.replyId = body('replyId')
  .optional()
  .custom(async (commentId, { req }) => {
    try {
      const r = await checkReplyId(replyId);
      req.reply = r;
    } catch (err) {
      return Promise.reject(err);
    }
  });
exports.content = body('content')
  .exists()
  .notEmpty()
  .withMessage('请输入评论')
  .customSanitizer((content) => xss(content));
