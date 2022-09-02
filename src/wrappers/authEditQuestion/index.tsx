import { Navigate, useAccess, useLocation, useParams } from '@umijs/max';
import { message } from 'antd';
import { Outlet } from 'umi';

// 编辑题目的拦截器 只有题目创建者和管理员可以编辑
export default () => {
  console.log(22222);
  // useAccess()
  const isAuth = false;

  console.log('  useAccess(): ', useAccess());
  console.log('  useAccess(): ', useParams());
  console.log('  useAccess(): ', useLocation());
  return <Outlet context={{ edit: true }} />;
  if (isAuth) {
    return <Outlet />;
  } else {
    message.warn('您不具备此权限！！');
    return <Navigate to='/login' replace />;
  }
};
