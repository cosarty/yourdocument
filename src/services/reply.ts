export type ReplyType = {
  _id: string,
  commentId?: string, // 评论id  一级评论
  content: string, // 评论内容
  isDelete: boolean, // 是否删除
  replyId: string, // 多级评论
  replyUserId: { nickname: string, avtar_url: string },
  questionId: string, // 问题id
}