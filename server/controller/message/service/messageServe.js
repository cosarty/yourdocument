const MessageModel = require('../../../model/messageSchame');
exports.checkMessage = async (messageId) => {
  const message = await MessageModel.findById(messageId);
  if (!message) return Promise.reject('消息不存在');
  return message;
};
