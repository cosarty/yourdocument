const { checkQutionsId } = require('../../questions/service/quetionsServe');
const { body } = require('express-validator');
const xss = require('xss');

exports.questionId = body('questionId').custom(async (questionId, { req }) => {
  try {
    const q = await checkQutionsId(questionId);
    req.question = q;
  } catch (err) {
    return Promise.reject(err);
  }
});
exports.content = body('content')
  .exists()
  .notEmpty()
  .withMessage('请输入评论')
  .customSanitizer((content) => xss(content));

exports.priority = body('priority').isBoolean().withMessage('采纳只能是true或者false');
