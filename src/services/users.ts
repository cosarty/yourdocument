import { request } from 'umi'



/**
 * 登录请求
 * @param payload  {email  password}
 * @returns API.Login
 */
export const login = async (payload: Payload.Login) => await request<API.Login>('user/login', {
  method: 'POST', data: payload
})



export default { login }