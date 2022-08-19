const cheerio = require('cheerio');
const xss = require('xss');
/**
 * 获取题目的显示标题
 * @param question
 */
exports.getQuestionTitle = (question) => {
  if (!question) {
    return '';
  }
  // 有标题直接用标题
  if (question.title) {
    return xss(question.title);
  }
  // 没标题，用描述代替
  return cheerio.load(question.detail).text().trim();
};
