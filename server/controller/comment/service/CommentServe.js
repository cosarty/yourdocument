const CommentModel = require('../../../model/commentSchema');

// 检查题目是否合法
exports.checkCommentId = async (commentid) => {
  const comment = await CommentModel.findById(commentid);
  if (!comment || comment.isDelete) return Promise.reject('评论不存在');
  return comment;
};
