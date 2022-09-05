const MessageModel = require('../../model/messageSchame');

// 添加评论
const countMessage = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const count = await MessageModel.find({ toUserId: _id, status: 0 }).count();

    res.status(200).send({
      code: 200,
      message: '获取成功!!',
      data: {
        count,
      },
    });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '操作失败', data: null });
  }
};

module.exports = [countMessage];
