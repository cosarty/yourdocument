import type { OrganizeType, SimpleUser } from '@/services/organize';
import { kickoutOg, publishPaper } from '@/services/organize';
import type { PaperType } from '@/services/paper';
import { issuedPaper } from '@/services/paper';
import type { OgInfoType } from '@/wrappers/authVieworgani';
import AuthVieworgani from '@/wrappers/authVieworgani';
import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import { history, useModel } from '@umijs/max';
import { Button, Col, Input, message, Popconfirm, Row, Space, Switch, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Approval from './Approval';
import style from './index.less';
import PaperDetail from './PaperDetail';

const Vieworgani: FC<
  OgInfoType & { og: OrganizeType; changePaper: () => void; isMaster: boolean }
> = ({ users, papers, og, changePaper, isMaster }) => {
  const [getPublish, setPublish] = useState<{ id?: string; isPublish?: boolean }[]>([{}]);
  const [selectPaper, setSelectPaper] = useState<string>('');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};

  const issuedOg = async (pid: string) => {
    await issuedPaper(pid, og._id);
    changePaper();
    if (pid === selectPaper) setSelectPaper('');
    message.success('删除成功');
  };

  // 踢出组织
  const kitout = async (uid: string) => {
    await kickoutOg(og._id, { userId: uid });
    changePaper();
    message.success('删除成功');
  };

  const selfPublish = (paper: PaperType) => {
    const publish = getPublish.find((p) => p.id === paper.papersId._id);
    return publish?.isPublish ?? paper.publish;
  };

  const renderUser = (user: SimpleUser) => ({
    title: (
      <>
        {user.user.nickname} {currentUser?._id === user.user._id && `(我)`}
      </>
    ),

    actions: [
      // <a key='s'>查看</a>,
      isMaster && (
        <Popconfirm
          key='delete'
          title='确认删除么，操作无法撤销'
          onConfirm={() => {
            kitout(user.user._id);
          }}
        >
          <Button danger type='link' style={{ padding: 0 }}>
            删除
          </Button>
        </Popconfirm>
      ),
      ,
    ],
    avatar: user.user.avtar_url,
    id: user.user._id,
    // content: (
    //   <div
    //     style={{
    //       flex: 1,
    //       width: 200,
    //     }}
    //   >
    //     <div>完成数:</div>
    //     <Progress percent={80} />
    //   </div>
    // ),
  });
  const rendPaper = (paper: PaperType) => {
    return {
      title: paper.papersId.name,
      subTitle: (
        <Tag color={selfPublish(paper) ? '#5BD8A6' : 'pink'}>
          {selfPublish(paper) ? '发布中' : '未发布'}
        </Tag>
      ),
      actions: [
        isMaster && (
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
          />
        ),
        // <a key='a'>答题</a>,
        <a
          key='s'
          onClick={() => {
            setSelectPaper(paper.papersId._id);
          }}
        >
          查看
        </a>,
        isMaster && (
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
          </Popconfirm>
        ),
      ],
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
      id: paper.papersId._id,
      content: (
        <div
          style={{
            flex: 1,
            display: 'flex',
          }}
        >
          <div>{paper.papersId.detail || '无'}</div>
        </div>
      ),
    };
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>{<title>{og.name} - 试题君</title>}</Helmet>
        <PageContainer
          onBack={() => {
            history.replace('/organi');
          }}
          tags={
            <Space>
              <Tag color='blue'>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {og.name}
                </Typography.Title>
              </Tag>

              <Typography.Paragraph
                style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}
                copyable={{ tooltips: ['邀请码'] }}
              >
                {og.flag}
              </Typography.Paragraph>
            </Space>
          }
          header={{
            style: {
              padding: '8px 16px',
              boxShadow: '0 2px 8px #f0f1f2',
            },
          }}
          fixedHeader
          extra={[
            <Input.Search key='search' placeholder='搜素试卷' />,
            // <Button key='3'>下发试卷</Button>,
            isMaster && (
              <Approval
                key={'approval'}
                refresh={() => {
                  changePaper();
                }}
                organizeId={og._id}
              />
            ),
          ]}
        >
          <Row className={style['content']} gutter={40} style={{ height: '100%' }}>
            <Col sm={24} md={10} className={style['content-left']}>
              <div className={style['paper-card']}>
                <Typography.Title level={4}>试卷列表</Typography.Title>
                <ProList<any>
                  ghost={true}
                  itemCardProps={{
                    ghost: true,
                  }}
                  pagination={{
                    defaultPageSize: 3,
                    hideOnSinglePage: true,
                    showSizeChanger: true,
                  }}
                  grid={{ gutter: 16, column: 1 }}
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
              </div>
              <div>
                <Typography.Title level={4}>用户信息</Typography.Title>
                <ProList<any>
                  ghost={true}
                  itemCardProps={{
                    ghost: true,
                  }}
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
              </div>
            </Col>
            <Col className={style['content-right']} sm={24} md={14}>
              <Typography.Title level={4}>试卷详情</Typography.Title>

              <PaperDetail
                paperId={selectPaper}
                organizeId={og._id}
                reset={() => {
                  setSelectPaper('');
                }}
              />
            </Col>
          </Row>
        </PageContainer>
      </HelmetProvider>
    </>
  );
};

export default AuthVieworgani(Vieworgani);
