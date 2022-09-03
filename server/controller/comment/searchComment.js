const CommentModel = require('../../model/commentSchema');

// 校验参数

// 获取评论
const searchComment = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const commentList = await CommentModel.find({
      user: _id,
      isDelete: false,
    }).populate({
      path: 'questionId',
      match: { isDelete: false },
    });

    console.log('commentList: ', commentList);

    res
      .status(200)
      .send({ code: 200, message: '获取成功!!', data: commentList.filter((c) => c.questionId) });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '获取失败', data: null });
  }
};

module.exports = [searchComment];
