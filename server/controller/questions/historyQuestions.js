const historyModel = require('../../model/historySchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const searchOriginQuestionsValidator = validator([
  body('pageSize').optional().isInt().withMessage('页面大小必须是整型的').toInt(),
  body('pageNum').optional().isInt().withMessage('页数必须是整型的').toInt(),
]);

const historyQuestions = async (req, res, next) => {
  try {
    const { pageSize, pageNum } = req.body;
    const skip = pageSize * (pageNum - 1);

    const queryQuestion = () =>
      historyModel
        .where({ userId: req.user._id })
        .sort({ create_time: -1 })
        .populate({ path: 'questionId', match: { isDelete: false } });

    const history = (await queryQuestion()).map((h) => h.questionId).filter(Boolean);

    const list = history.slice(skip, pageNum);
    const total = list.length;
    res.status(200).send({
      code: 200,
      message: '获取成功!!!',
      data: { list, total },
    });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '失败', data: null });
  }
};

module.exports = [searchOriginQuestionsValidator, historyQuestions];
