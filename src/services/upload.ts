import { request } from 'umi'


export const uploadAvatar = async (payload: Payload.UploadAvatar) => await request<API.Upload>('/api/user/login', {
  method: 'POST', data: payload
})



export default {
  uploadAvatar
}