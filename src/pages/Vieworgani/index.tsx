import type { OrganizeType, SimpleUser } from '@/services/organize';
import type { PaperType } from '@/services/paper';
import type { OgInfoType } from '@/wrappers/authVieworgani';
import AuthVieworgani from '@/wrappers/authVieworgani';
import { ProCard } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import { history } from '@umijs/max';
import { Button, Empty, Input, Progress, Switch, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import style from './index.less';

const rendPaper = (paper: PaperType) => ({
  title: paper.papersId.name,
  subTitle: (
    <Tag color={paper.publish ? '#5BD8A6' : 'pink'}>{paper.publish ? '发布中' : '未发布'}</Tag>
  ),
  actions: [
    <Switch key='fds' checkedChildren='开启' unCheckedChildren='关闭' defaultChecked />,
    <a key='a'>答题</a>,
    <a key='s'>查看</a>,
    <a key='delete'>删除</a>,
  ],
  avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
  id: paper.papersId._id,
  content: (
    <div
      style={{
        flex: 1,
      }}
    >
      <div>{paper.papersId.detail || '无'}</div>
    </div>
  ),
});

const renderUser = (user: SimpleUser) => ({
  title: user.user.nickname,

  actions: [<a key='s'>查看</a>, <a key='delete'>删除</a>],
  avatar: user.user.avtar_url,
  id: user.user._id,
  content: (
    <div
      style={{
        flex: 1,
        width: 200,
      }}
    >
      <div>完成数:</div>
      <Progress percent={80} />
    </div>
  ),
});

const Vieworgani: FC<OgInfoType & { og: OrganizeType }> = ({ users, papers, og }) => {
  return (
    <>
      <HelmetProvider>
        <Helmet>{<title>{og.name} - 试题君</title>}</Helmet>
        <PageContainer
          onBack={() => {
            history.replace('/organi');
          }}
          tags={
            <Tag color='blue'>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {og.name}
              </Typography.Title>
            </Tag>
          }
          header={{
            style: {
              padding: '8px 16px',
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
            <Input.Search key='search' />,
            <Button key='3'>下发试卷</Button>,
            <Button key='2' type='primary'>
              审批
            </Button>,
          ]}
        >
          <ProCard
            style={{ marginBlockStart: 24 }}
            title={'试卷信息'}
            className={style['paper-card']}
          >
            <ProList<any>
              ghost={true}
              itemCardProps={{
                ghost: true,
              }}
              pagination={{
                defaultPageSize: 9,
                hideOnSinglePage: true,
                showSizeChanger: true,
              }}
              grid={{ gutter: 16, column: 3 }}
              onItem={(record: any) => {
                return {
                  onClick: () => {
                    console.log(record);
                  },
                };
              }}
              metas={{
                title: {},
                subTitle: {},
                type: {},
                avatar: {},
                content: {},
                actions: {
                  cardActionProps: 'extra',
                },
              }}
              showHeader
              bordered={false}
              dataSource={papers.map((paper) => rendPaper(paper))}
            />
          </ProCard>
          <ProCard style={{ marginBlockStart: 24 }} gutter={12} title={'成员'} split='vertical'>
            <ProCard bordered={false} headerBordered={false}>
              <ProList<any>
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  hideOnSinglePage: true,
                }}
                bordered={false}
                metas={{
                  title: {},
                  type: {},
                  avatar: {},
                  content: {},
                  actions: {},
                }}
                dataSource={users.map((user) => renderUser(user))}
              />
            </ProCard>

            <ProCard title='详情'>
              <div style={{ height: 360 }}>
                <Empty />
              </div>
            </ProCard>
          </ProCard>
        </PageContainer>
      </HelmetProvider>
    </>
  );
};

export default AuthVieworgani(Vieworgani);
