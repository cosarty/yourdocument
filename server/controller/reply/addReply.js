const ReplyModel = require('../../model/replySchema');
const validator = require('../../middleware/validator');
const { content, questionId, commentId, replyId } = require('./service/ReplyValidate');
const addMessage = require('../message/addmessage');
const { getQuestionTitle } = require('../../util/bUtils');

// 校验参数
const addReplyValidator = [
  validator([validator.isValidObjectId(['body'], 'questionId')]),
  validator([questionId, content, commentId, replyId]),
];

// 添加回复
const addReply = async (req, res, next) => {
  try {
    const payload = {};
    const { _id, nickname } = req.user;
    const { commentId, replyId, ...re } = req.body;
    replyId && (payload.replyId = replyId);
    commentId && (payload.commentId = commentId);
    const reply = new ReplyModel({ ...payload, ...re, replyUserId: _id });

    await addMessage({
      toUserId: req.question.userId,
      title: `有人回复了你的评论`,
      content: ` ${nickname} 回答了${getQuestionTitle(req.question)}:${content}`,
      sendEmail: false,
      type: 5,
    });

    await reply.save();
    res.status(200).send({ code: 200, message: '回复成功!!', data: reply });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '回复失败！！', data: null });
  }
};

module.exports = [addReplyValidator, addReply];
