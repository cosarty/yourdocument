/* eslint-disable react-hooks/rules-of-hooks */
import users from '@/services/users'
import { history, useModel } from '@umijs/max'
import { getStorage, removeStorage, setStorage } from '@/util/storage'
import { TOKEN_KEY } from '@/constant/storKey'
import { message } from 'antd'

const useUser = () => {

  const { search, pathname } = location
  const { setInitialState } = useModel('@@initialState');


  const gotoLogin = () => {
    const params = new URLSearchParams()
    params.set('redirect', pathname + search)
    history.push({ pathname: '/login', search: params.toString() })
  }
  const login = async (pra: Payload.Login) => {
    const { data } = await users.login(pra)
    setStorage(TOKEN_KEY, data?.token)
    // 获取当前登录用户
    try {
      const user = await users.getCurrentUser()

      // 保存用户信息
      if (user) await setInitialState((s) => ({ ...s, currentUser: user.data }));
      const redirect = new URLSearchParams(search).get('redirect')
      history.push(redirect ?? '/')
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

  // 注册
  const register = () => {

  }

  return {
    gotoLogin,
    login,
    logout,
    register
  }
}


export default useUser