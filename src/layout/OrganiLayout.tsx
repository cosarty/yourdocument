import { PageContainer } from '@ant-design/pro-layout';
import { history, useLocation } from '@umijs/max';
import { Button, Input, Tag } from 'antd';
/* 
const defaultProps = {
  routes: [
    {
      name: '成员',
      path: '/vieworgani/my',
      component: '../pages/Welcome',
      icon: <CodeOutlined />,
    },
    {
      name: '试卷',
      path: '/vieworgani/paper',
      component: '../pages/Welcome',
      icon: <CodeOutlined />,
    },
  ],
};
 */
export default () => {
  const { state } = useLocation();
  console.log('state: ', state);
  // if (!state?.id) {
  //   message.success('参数错误!!!');
  //   return <Navigate to='/login' replace />;
  // }
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
            width: '100%',
            // left: 0,
            // zIndex: 999,
            boxShadow: '0 2px 8px #f0f1f2',
          },
        }}
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
