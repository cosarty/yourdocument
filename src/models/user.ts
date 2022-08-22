/* eslint-disable react-hooks/rules-of-hooks */
import users from '@/services/users'
import { history } from '@umijs/max'

const useUser = () => {

  const { search, pathname } = location
  const params = new URLSearchParams()


  // 跳转登录页  然后 设置url
  // 然后登录之后获取当前登录用户跳转实现

  const gotoLogin = () => {
    params.set('redirect', pathname + search)
    history.push({ pathname: '/login', search: params.toString() })
  }

  const login = async (pra: Payload.Login) => {
    const data = await users.login(pra)
    console.log(data)
  }


  const logout = () => {

  }

  return {
    gotoLogin,
    login,
    logout
  }
}


export default useUser