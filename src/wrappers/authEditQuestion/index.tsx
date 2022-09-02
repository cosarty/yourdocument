import { Navigate, useAccess, useLocation, useParams } from '@umijs/max';
import { message } from 'antd';
import { Outlet } from 'umi';

// 编辑题目的拦截器 只有题目创建者和管理员可以编辑
export default () => {
  const { state } = useLocation();
  const { questionId } = useParams();
  const { canAdmin } = useAccess();

  if (state && ((state as any)?.auth || canAdmin) && questionId) {
    return <Outlet context={{ edit: true, questionId }} />;
  } else {
    message.warn('您不具备此权限！！');
    return <Navigate to='/login' replace />;
  }
};
