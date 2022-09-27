import type { OrganizeType } from '@/services/organize';
import { viewPaper, viewUsers } from '@/services/organize';
import type { PaperType } from '@/services/paper';
import { Navigate, useAccess, useLocation } from '@umijs/max';
import { message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

export type OgInfoType = { papers: PaperType[]; users: OrganizeType['part'] };

// 编辑题目的拦截器 只有题目创建者和管理员可以编辑
export default (Component: React.FC<OgInfoType>) => () => {
  const {
    state: { og },
  } = (useLocation() as { state: { og: OrganizeType } }) ?? {};
  const { canLogin } = useAccess();
  const [loading, setLoading] = useState(false);
  const [ogInfo, setOgInfo] = useState<OgInfoType>({
    papers: [],
    users: [],
  });

  if (!og?._id || !canLogin) {
    message.warn('组织无效请重新登录!!!!');
    return <Navigate to='/login' replace />;
  }

  const loadData = async () => {
    const [paper, user] = await Promise.all([
      viewPaper(og._id).then(({ data: d }) => d),
      viewUsers(og._id).then(({ data: d }) => d),
    ]);
    setOgInfo({ users: user ?? [], papers: paper ?? [] });
    setLoading(false);
  };

  useEffect(() => {
    if (!og?._id || !canLogin) return;
    loadData();
  }, []);

  return loading ? (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <Spin size='large' wrapperClassName='aaa' />{' '}
    </div>
  ) : (
    <Component {...ogInfo} />
  );
};
