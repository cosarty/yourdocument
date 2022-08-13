const historyModel = require('../../model/historySchema');

const historyQuestions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const history = await historyModel.find({ userId }).limit(50);
    res.status(200).send({
      code: 202,
      message: '获取成功!!!',
      data: history,
    });
  } catch (error) {
    next({ code: 500, message: '失败', data: null });
  }
};

module.exports = [historyQuestions];
