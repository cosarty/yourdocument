import type { OrganizeType } from '@/services/organize';
import { viewPaper, viewUsers } from '@/services/organize';
import type { PaperType } from '@/services/paper';
import { Navigate, useAccess, useLocation, useModel } from '@umijs/max';
import { message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

export type OgInfoType = { papers: PaperType[]; users: OrganizeType['part'] };

// 编辑题目的拦截器 只有题目创建者和管理员可以编辑
export default (
    Component: React.FC<
      OgInfoType & { og: OrganizeType; changePaper: () => void; isMaster: boolean }
    >,
  ) =>
  () => {
    const { state } = (useLocation() as { state: { og: OrganizeType } }) ?? {};
    const { initialState } = useModel('@@initialState');
    const { currentUser } = initialState || {};

    const { canLogin } = useAccess();
    const [loading, setLoading] = useState(false);
    const [ogInfo, setOgInfo] = useState<OgInfoType>({
      papers: [],
      users: [],
    });

    if (!state || !state.og?._id || !canLogin) {
      message.warn('组织无效!!!!');
      return <Navigate to='/organi' replace />;
    }

    const loadData = async () => {
      setLoading(true);
      const [paper, user] = await Promise.all([
        viewPaper(state.og._id).then(({ data: d }) => d),
        viewUsers(state.og._id).then(({ data: d }) => d),
      ]).finally(() => {
        setLoading(false);
      });
      setOgInfo({
        users: (user ?? []).sort((p) => (p.user_id === currentUser?._id ? 1 : -1)),
        papers: paper ?? [],
      });
    };

    useEffect(() => {
      if (!state.og?._id || !canLogin) return;
      loadData();
    }, []);

    return loading ? (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <Spin size='large' wrapperClassName='aaa' />{' '}
      </div>
    ) : (
      <Component
        {...ogInfo}
        og={state.og}
        isMaster={currentUser?._id === state.og.userId}
        changePaper={() => {
          loadData();
        }}
      />
    );
  };
