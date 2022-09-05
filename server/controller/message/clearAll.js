const MessageModel = require('../../model/messageSchame');

// 清空评论
const clearAllMessage = async (req, res, next) => {
  try {
    const { _id } = req.user;

    await MessageModel.find({ toUserId: _id }).updateMany({ isDelete: true });

    res.status(202).send({
      code: 202,
      message: '清空成功!!',
      data: null,
    });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '操作失败', data: null });
  }
};

module.exports = [clearAllMessage];
