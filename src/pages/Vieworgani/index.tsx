import type { OrganizeType, SimpleUser } from '@/services/organize';
import { publishPaper } from '@/services/organize';
import type { PaperType } from '@/services/paper';
import { issuedPaper } from '@/services/paper';
import type { OgInfoType } from '@/wrappers/authVieworgani';
import AuthVieworgani from '@/wrappers/authVieworgani';
import { ProCard } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import { history } from '@umijs/max';
import { Button, Input, message, Popconfirm, Progress, Switch, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Approval from './Approval';
import style from './index.less';

const renderUser = (user: SimpleUser) => ({
  title: user.user.nickname,

  actions: [
    // <a key='s'>查看</a>,
    <a key='delete'>删除</a>,
  ],
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

const Vieworgani: FC<OgInfoType & { og: OrganizeType; changePaper: () => void }> = ({
  users,
  papers,
  og,
  changePaper,
}) => {
  const [getPublish, setPublish] = useState<{ id?: string; isPublish?: boolean }[]>([{}]);

  const issuedOg = async (pid: string) => {
    await issuedPaper(pid, og._id);
    changePaper();
    message.success('删除成功');
  };

  const selfPublish = (paper: PaperType) => {
    const publish = getPublish.find((p) => p.id === paper.papersId._id);
    return publish?.isPublish ?? paper.publish;
  };

  const rendPaper = (paper: PaperType) => {
    return {
      title: paper.papersId.name,
      subTitle: (
        <Tag color={selfPublish(paper) ? '#5BD8A6' : 'pink'}>
          {selfPublish(paper) ? '发布中' : '未发布'}
        </Tag>
      ),
      actions: [
        <Switch
          key='fds'
          checkedChildren='关闭'
          unCheckedChildren='开放'
          defaultChecked={paper.publish}
          onChange={() => {
            publishPaper(og._id, paper.papersId._id).then(({ code, message: msg }) => {
              if (code === 200) {
                message.success(msg);
                const p = getPublish.find((p) => p.id === paper.papersId._id);
                if (p) {
                  p.isPublish = !p.isPublish;
                } else {
                  getPublish.push({ id: paper.papersId._id, isPublish: !paper.publish });
                }
                setPublish([...getPublish]);
              }
            });
          }}
        />,
        // <a key='a'>答题</a>,
        <a key='s'>查看</a>,
        <Popconfirm
          key='delete'
          title='确认删除么，操作无法撤销'
          onConfirm={() => {
            issuedOg(paper.papersId._id);
          }}
        >
          <Button danger type='link' style={{ padding: 0 }}>
            删除
          </Button>
        </Popconfirm>,
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
    };
  };

  const approval = () => {};

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
              boxShadow: '0 2px 8px #f0f1f2',
            },
          }}
          fixedHeader
          extra={[
            <Input.Search key='search' />,
            // <Button key='3'>下发试卷</Button>,
            <Approval key={'approval'} refresh={() => {}} organizeId={og._id} />,
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
          <ProCard
            className={style['user-card']}
            style={{ marginBlockStart: 24 }}
            gutter={12}
            title={'成员'}
          >
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

            {/* <ProCard title='详情'>
              <div style={{ height: 300 }}>
                <Empty />
              </div>
            </ProCard> */}
          </ProCard>
        </PageContainer>
      </HelmetProvider>
    </>
  );
};

export default AuthVieworgani(Vieworgani);
