const CommentModel = require('../../model/commentSchema');
const validator = require('../../middleware/validator');
const { content, questionId } = require('./service/commentValidate');
const addMessage = require('../message/addmessage');
const { getQuestionTitle } = require('../../util/bUtils');
// 校验参数
const addCommentValidator = [
  validator([validator.isValidObjectId(['body'], 'questionId')]),
  validator([questionId, content]),
];

// 添加评论
const addComment = async (req, res, next) => {
  try {
    const { _id, nickname } = req.user;

    const { questionId, content } = req.body;
    const comment = new CommentModel({ questionId, content, user: _id });

    await addMessage({
      toUserId: req.question.userId,
      title: `有人回复了你的题问`,
      content: ` ${nickname} 回答了${getQuestionTitle(req.question)}:${content}`,
      sendEmail: true,
      type: 4,
    });
    // 评论数加一
    req.question.commentNum += 1;
    await req.question.save();
    await comment.save();
    res
      .status(200)
      .send({ code: 200, message: '评论成功!!', data: await comment.populate('user') });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '评论失败', data: null });
  }
};

module.exports = [addCommentValidator, addComment];
