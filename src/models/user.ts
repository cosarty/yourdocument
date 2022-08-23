/* eslint-disable react-hooks/rules-of-hooks */
import users from '@/services/users'
import { history, useModel } from '@umijs/max'
import { getStorage, removeStorage, setStorage } from '@/util/storage'
import { TOKEN_KEY } from '@/constant/storKey'
import { message } from 'antd'

const useUser = () => {

  const { search, pathname } = location
  const { setInitialState } = useModel('@@initialState');
  const params = new URLSearchParams()


  // 跳转登录页  然后 设置url
  // 然后登录之后获取当前登录用户跳转实现

  const gotoLogin = () => {
    params.set('redirect', pathname + search)
    history.push({ pathname: '/login', search: params.toString() })
  }

  const login = async (pra: Payload.Login) => {
    const data = await users.login(pra)
    setStorage(TOKEN_KEY, data?.token)
    // 获取当前登录用户
    try {
      const user = await users.getCurrentUser()
      console.log('user: ', user);
    } catch (error) {
      message.error('登录失败！！')
    }

  }


  const logout = () => {
    if (getStorage(TOKEN_KEY)) {
      removeStorage(TOKEN_KEY)
    }
    gotoLogin()
  }

  return {
    gotoLogin,
    login,
    logout
  }
}


export default useUser