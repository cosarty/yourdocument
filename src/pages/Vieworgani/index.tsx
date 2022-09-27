import type { OgInfoType } from '@/wrappers/authVieworgani';
import AuthVieworgani from '@/wrappers/authVieworgani';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from '@umijs/max';
import { Button, Input, Tag } from 'antd';
import type { FC } from 'react';

const Vieworgani: FC<OgInfoType> = ({ users, papers }) => {
  console.log('users,papers: ', users, papers);
  return (
    <>
      <PageContainer
        onBack={() => {
          history.replace('/organi');
        }}
        tags={<Tag color='blue'>状态一</Tag>}
        header={{
          style: {
            // padding: '8px 16px',
            // backgroundColor: '#fff',
            // position: 'fixed',
            // top: 0,
            // width: '100%',
            // left: 0,
            // zIndex: 999,
            boxShadow: '0 2px 8px #f0f1f2',
          },
        }}
        fixedHeader
        extra={[
          <Input.Search
            key='search'
            style={{
              width: 240,
            }}
          />,
          <Button key='3'>操作一</Button>,
          <Button key='2' type='primary'>
            操作一
          </Button>,
        ]}
      >
        <div
          style={{
            height: '120vh',
            minHeight: 600,
          }}
        >
          fgds
        </div>
      </PageContainer>
    </>
  );
};

export default AuthVieworgani(Vieworgani);
