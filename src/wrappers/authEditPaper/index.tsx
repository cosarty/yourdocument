import { Navigate, useAccess, useLocation } from '@umijs/max';
import { message } from 'antd';
import { Outlet } from 'umi';

export default () => {
  const { state } = useLocation();
  const { paperId } = state as { paperId?: string };
  const { canLogin } = useAccess();
  if (canLogin && paperId) {
    return <Outlet context={{ edit: true, paperId }} />;
  } else {
    message.warn('您不具备此权限！！');
    return <Navigate to='/login' replace />;
  }
};
