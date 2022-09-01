import { request } from 'umi'
import { ReplyType } from './reply'

export type CommentType = {
  _id: string,
  user: { nickname: string, avtar_url: string, _id: string }, // 用户id
  questionId: string, // 问题id
  content: string, // 回答内容
  priority: boolean, // 采纳
  // thumbNum: String, // 点赞
  replyList: ReplyType[],
  isDelete: boolean,
  create_time: Date;
  update_time: Date;
}

export const getComment = async (payload: { questionId: string }) => await request<API.API_TYPE<CommentType[]>>('/api/comment/get', {
  method: 'GET', params: payload
})

export const addComment = async (payload: { questionId: string, content: string }) => await request<API.API_TYPE<CommentType>>('/api/comment/add',
  {
    method: 'POST', data: payload
  })


export const updateComment = async (payload: { questionId: string, content: string, commentId: string }) => await request<API.API_TYPE<CommentType>>('/api/comment/update', {
  method: 'PUT', data: payload
})


export const deleteComment = async (commentId: string) => await request<API.API_TYPE<CommentType>>(`/comment/delete/${commentId}`, {
  method: 'DELETE'
})
export const priorityComment = async (payload: { commentId: string, priority: string }) => await request<API.API_TYPE<CommentType>>(`/comment/update/priority`, {
  method: 'POST',
  data: payload
})




export default {
  getComment,
  addComment,
  updateComment,
  deleteComment,
  priorityComment

}