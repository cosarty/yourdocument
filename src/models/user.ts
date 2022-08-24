/* eslint-disable react-hooks/rules-of-hooks */
import users from '@/services/users'
import { useModel, history as historys } from '@umijs/max'

import { getStorage, removeStorage, setStorage } from '@/util/storage'
import { TOKEN_KEY } from '@/constant/storKey'
import { message } from 'antd'


const useUser = () => {


  const { setInitialState } = useModel('@@initialState');


  const gotoLogin = () => {
    const { search, pathname } = location
    const params = new URLSearchParams()
    params.set('redirect', pathname + search)
    historys.replace({ pathname: '/login', search: params.toString() })

  }

  // 获取当前用户
  const getUser = async () => {
    const user = await users.getCurrentUser()
    if (user) await setInitialState((s) => ({ ...s, currentUser: user.data }));
    else await setInitialState((s) => ({ ...s, currentUser: null }));
  }


  const login = async (pra: Payload.Login) => {
    const { search } = location
    const { data } = await users.login(pra)
    setStorage(TOKEN_KEY, data?.token)
    // 获取当前登录用户
    try {
      // 保存用户信息
      await getUser()
      const redirect = new URLSearchParams(search).get('redirect')
      // history.replace({ pathname: redirect ?? '/' })
      // 设置但是不跳转
      // window.history.replaceState(null, null, redirect ?? '/')
      // history.go()
      window.location.href = redirect ?? '/';
    } catch (error) {
      message.error('登录失败！！')
    }
  }



  const logout = () => {
    if (getStorage(TOKEN_KEY)) {
      removeStorage(TOKEN_KEY)
    }
    window.location.href = '/'
  }

  // 注册
  const register = async (pra: Payload.Register) => {
    const { code } = await users.register(pra)
    return code === 200
  }

  return {
    gotoLogin,
    login,
    logout,
    register,
    getUser
  }
}


export default useUser