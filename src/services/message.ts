import { request } from 'umi'


export type MessageType = {
  _id: string
  content: string,
  toUserId: { nickname: string },
  isDelete: boolean,
  status: number, // 0 未读  1 已读
  title: string,
  create_time: Date

}


export const updateMessage = async (payload: { status?: string, messageId: string, isDelete?: boolean }) => await request<API.API_TYPE<null>>('/api/message/update', {
  method: 'PUT', data: payload
})
export const updateAllMessage = async () => await request<API.API_TYPE<null>>('/api/message/updateAll', {
  method: 'PUT', data: { status: 1 }
})
export const searchMessage = async (payload: { status?: string, pageSize: number, pageNum: number }) => await request<API.API_TYPE<{ list: MessageType[], total: number }>>('/api/message/search', {
  method: 'POST', data: payload
})
export const countMessage = async () => await request<API.API_TYPE<{ count: number }>>('/api/message/count', {
  method: 'GET'
})
export const clearMessage = async () => await request<API.API_TYPE<null>>('/api/message/clearAll', {
  method: 'DELETE'
})



