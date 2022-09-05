const MessageModle = require('../../model/messageSchame');
const sendMail = require('../../util/sendMail');
const cheerio = require('cheerio');
/**
 * 发送系统消息（内部调用）
 * @param context   { toUserId, title, content, sendEmail, mailContent }
 * @return {Promise<*|boolean>}
 */

const getTitle = (title) => {
  return cheerio.load(question.detail).text().trim();
};

const addMessage = async (contexnt) => {
  const { sendEmail, mailContent, ...op } = contexnt;

  if (!op.toUserId || !op.title) {
    return false;
  }

  try {
    let message = await new MessageModle(op);
    message = await message.populate('toUserId');
    await message.save();
    // 是否发送邮件
    if (
      (sendEmail && message.toUserId.email && !message.toUserId.is_ban) ||
      message.toUserId.auth !== 'super'
    ) {
      // 美化标题
      const mailTitle = cheerio.load(op.title).text().trim();
      const macontent = cheerio
        .load(mailContent ?? op.content)
        .text()
        .trim();
      await sendMail({
        to: message.toUserId.email,
        subject: `${mailTitle}`,
        content: macontent,
      });
    }
    return true;
  } catch (error) {
    console.log('error: ', error);
    return false;
  }
};

module.exports = addMessage;
