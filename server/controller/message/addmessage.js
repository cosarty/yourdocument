const MessageModle = require('../../model/messageSchame');
const sendMail = require('../../util/sendMail');

/**
 * 发送系统消息（内部调用）
 * @param context   { toUserId, title, content, sendEmail, mailContent }
 * @return {Promise<*|boolean>}
 */

const addMessage = async (contexnt, user) => {
  const { sendEmail, mailContent, ...op } = contexnt;

  if (!op.toUserId || !op.title || !op.toUserId) {
    return false;
  }

  try {
    let message = await new MessageModle(op);
    message = await message.populate('toUserId');

    // 是否发送邮件
    if (
      (sendEmail && message.toUserId.email && !message.toUserId.isDelete) ||
      message.toUserId.auth !== 'super'
    ) {
      // 美化标题
      const mailTitle = cheerio.load(op.title).text().trim();
      await sendMail({
        to: message.toUserId.email,
        subject: `试题君${mailTitle}`,
        content: mailContent ?? op.content,
      });
    }
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = addMessage;
