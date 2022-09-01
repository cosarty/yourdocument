/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-key */
import defaultAvtar from '@/assets/shitijun.png';
import CommentList from '@/components/CommentList';
import QuestionDetailCard from '@/components/QuestionDetailCard';
import {
  QUESTION_DIFFICULTY_COLOR_ENUM,
  QUESTION_DIFFICULTY_ENUM,
  QUESTION_TYPE_ENUM,
} from '@/constant/question';
import type { QuestionsType } from '@/services/question';
import { favourQuestion, getQuestions } from '@/services/question';
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { useAccess, useModel, useParams } from '@umijs/max';
import { Avatar, Button, Card, Col, Divider, Dropdown, Menu, message, Row, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const QuestionDetail = () => {
  const [loading, setLoading] = useState(false);
  const [isFavour, setIsFavour] = useState<boolean>(false);
  const [favourLoading, setFavourLoading] = useState<boolean>(false);
  const [showReference, setShowReference] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const { getUser } = useModel('user');
  const { questionId } = useParams() as { questionId: string };
  const { currentUser } = initialState || {};
  const [qd, setQd] = useState<QuestionsType>();
  const { canLogin } = useAccess();

  const getQuestion = async (id: string) => {
    const q = await getQuestions(id);
    if (q.code === 200) {
      // tslint:disable-next-line: no-non-null-assertion
      setQd(q.data!);
    }
  };

  useEffect(() => {
    setLoading(true);
    getQuestion(questionId).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (qd) {
      setIsFavour(currentUser?.favours?.includes(qd?._id || '') ?? false);
    }
  }, [currentUser, qd]);

  /**
   * 收藏
   */
  const doFavour = async () => {
    if (!qd?._id || favourLoading) {
      return;
    }

    setFavourLoading(true);
    const res = await favourQuestion(qd?._id || '');
    setFavourLoading(false);

    if (res.code === 202) {
      (res?.data?.mit as number) < 0 ? setIsFavour(false) : setIsFavour(true);

      message.success(res.message);

      await getUser();
    } else {
      message.error('操作失败');
    }
  };

  // 是否允许编辑题目
  const canEdit = canLogin || qd?.userId === currentUser?._id;

  const getAction = () => {
    const actions = [
      <div
        onClick={() => {
          doFavour();
        }}
      >
        <Space>
          {isFavour ? (
            <>
              <StarFilled />
              已收藏
            </>
          ) : (
            <>
              <StarOutlined />
              收藏
            </>
          )}
        </Space>
      </div>,
    ];

    if (canEdit) {
      actions.push(
        <Dropdown
          overlay={
            <Menu
              items={[
                { key: 'edit', icon: <EditOutlined />, label: '修改' },
                { key: 'del', icon: <DeleteOutlined />, label: '删除' },
              ]}
            />
          }
          arrow
        >
          <Space>
            <MoreOutlined /> 操作
          </Space>
        </Dropdown>,
      );
    }

    return actions;
  };

  return (
    <HelmetProvider>
      <Helmet>{qd && <title>{qd?.title.substring(0, 40)} - 试题君</title>}</Helmet>
      <GridContent style={{ overflowX: 'hidden' }}>
        <Row gutter={[24, 24]}>
          <Col xl={16} lg={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              actions={currentUser ? getAction() : undefined}
              loading={loading}
              title={
                <Space split={<Divider type='vertical' />} wrap align='center'>
                  <span>{QUESTION_TYPE_ENUM[qd?.type ?? 0]}</span>
                  <div>
                    <Tag color={QUESTION_DIFFICULTY_COLOR_ENUM[qd?.difficulty || 0]}>
                      {QUESTION_DIFFICULTY_ENUM[qd?.difficulty || 0]}
                    </Tag>
                    {qd?.tags.map((tag: string) => {
                      return <Tag key={tag}>{tag}</Tag>;
                    })}
                  </div>
                </Space>
              }
            >
              {qd?._id && (
                <>
                  <QuestionDetailCard question={qd} showReference={showReference} />
                  <div style={{ marginBottom: 16 }} />
                  {(qd?.reference || qd?.params?.answer) && (
                    <Row justify='space-between'>
                      <Space size='middle'>
                        <Button
                          type='primary'
                          danger={showReference}
                          onClick={() => {
                            // 如果是隐藏解析，回到顶部
                            if (showReference) {
                              window.scrollTo(0, 0);
                            }
                            setShowReference(!showReference);
                          }}
                        >
                          {showReference ? '隐藏解析' : '查看解析'}
                        </Button>
                      </Space>
                    </Row>
                  )}
                </>
              )}
            </Card>
            <Card title='评论区'> {qd && <CommentList question={qd} />}</Card>
          </Col>
          <Col xl={8} lg={24} xs={24}>
            <Card title='题目信息' bodyStyle={{ paddingBottom: 8 }}>
              <p>浏览数：{(qd?.viewNum ?? 0) + 1}</p>
              {qd?.create_time && <p>发布时间：{new Date(qd?.create_time).toLocaleDateString()}</p>}
              <div>
                上传者：
                {
                  <Space size={10} align='center'>
                    <Avatar src={qd?.userId?.avtar_url || defaultAvtar} />
                    <span>{qd?.userId?.nickname}</span>
                  </Space>
                }
                {/* <Space>
                  <UserInfoCardPopover user={user}>
                    <Avatar src={user?.avatarUrl || DEFAULT_AVATAR} />
                  </UserInfoCardPopover>
                  <UserTitleBar user={user} />
                </Space> */}
              </div>
            </Card>
            <div style={{ marginBottom: 24 }} />
          </Col>
        </Row>
      </GridContent>
    </HelmetProvider>
  );
};

export default QuestionDetail;
