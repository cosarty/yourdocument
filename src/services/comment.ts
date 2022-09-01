import { request } from 'umi'
import { ReplyType } from './reply'

export type CommentType = {
  _id: string,
  user: { nickname: string, avtar_url: string }, // 用户id
  questionId: string, // 问题id
  content: string, // 回答内容
  priority: boolean, // 采纳
  // thumbNum: String, // 点赞
  replyList: ReplyType[],
  isDelete: boolean,
}

export const getComment = async (payload: { questionId: string }) => await request<API.API_TYPE<CommentType[]>>('/api/comment/get', {
  method: 'GET', params: payload
})



export default {
  getComment

}