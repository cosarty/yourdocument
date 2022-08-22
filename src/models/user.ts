/* eslint-disable react-hooks/rules-of-hooks */
import users from '@/services/users'
import { useLocation, history, useSearchParams } from '@umijs/max'

const user = () => {

  const location = useLocation()
  const [searchParams] = useSearchParams();

  // 跳转登录页  然后 设置url
  // 然后登录之后获取当前登录用户跳转实现

  const gotoLogin = () => {
    searchParams.set('redirect', location.pathname)
    history.push({ pathname: '/login', search: searchParams.toString() })
  }

  const login = async (pra: Payload.Login) => {
    const { data } = await users.login(pra)
    console.log(data)
  }


  return {
    gotoLogin,
    login,
  }
}


export default user