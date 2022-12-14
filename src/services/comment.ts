import { request } from 'umi'
import { QuestionsType } from './question';
import { ReplyType } from './reply'

export type CommentType = {
  _id: string,
  user: { nickname: string, avtar_url: string, _id: string }, // 用户id
  questionId: QuestionsType, // 问题id
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


export const deleteComment = async (payload: { commentId: string, questionId: string }) => await request<API.API_TYPE<CommentType>>(`/api/comment/delete`, {
  method: 'DELETE', data: payload
})
export const priorityComment = async (payload: { commentId: string, priority: boolean }) => await request<API.API_TYPE<CommentType>>(`/api/comment/update/priority`, {
  method: 'POST',
  data: payload
})


export const searchComment = async () => await request<API.API_TYPE<CommentType[]>>('/api/comment/search', {
  method: 'GET'
})



export default {
  getComment,
  addComment,
  updateComment,
  deleteComment,
  priorityComment

}