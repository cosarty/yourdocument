const ReplyModel = require('../../../model/replySchema');

// 检查题目是否合法
exports.checkReplyId = async (replyId) => {
  const reply = await ReplyModel.findById(replyId);
  if (!reply || reply.isDelete) return Promise.reject('回复不存在');
  return reply;
};
