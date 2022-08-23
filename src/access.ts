/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser['data'] } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log('currentUser?.auth: ', currentUser?.auth);
  return {
    canAdmin: ['admin', 'super'].includes(currentUser?.auth ?? ''),
    canLogin: !!currentUser,
    canSuper: currentUser?.auth === 'super'
  };
}
export interface AccessType {
  canAdmin: boolean; // 是否为管理员
  canLogin: boolean; // 是否已登录
  canSuper: boolean; // 是否被封号
}