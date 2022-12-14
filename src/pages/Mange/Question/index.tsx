/* eslint-disable react/jsx-key */
import defaultAvtar from '@/assets/shitijun.png';
import CommentList from '@/components/CommentList';
import QuestionDetailCard from '@/components/QuestionDetailCard';
import QuestionRejectModal from '@/components/QuestionRejectModal';
import SelectTag from '@/components/SelectTag';
import {
  QUESTION_DIFFICULTY_COLOR_ENUM,
  QUESTION_DIFFICULTY_ENUM,
  QUESTION_TYPE_ENUM,
  REVIEW_STATUS_ENUM,
  REVIEW_STATUS_MAP,
  REVIEW_STATUS_MAP_INFO,
} from '@/constant/question';
import {
  deleteQuestion,
  getAllQuetions,
  getQuestions,
  QuestionsType,
  reviewQuestion,
} from '@/services/question';
import { getQuestionTitle } from '@/util/businessUtils';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { LightFilter, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  List,
  Menu,
  message,
  Popconfirm,
  Row,
  Space,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE_SIZE = 4;

const MangeQuestion = () => {
  const [total, setTotal] = useState<number>(0);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionsType[]>([]);

  const [questionId, setQuestionId] = useState<string>('');
  const [currQuestion, setCurrQuestion] = useState<QuestionsType>({} as any);
  const [commentDrawerVisible, setCommentDrawerVisible] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useState<Payload.QuestionSearchParams>({
    reviewStatus: REVIEW_STATUS_ENUM.REVIEWING,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const loadData = async () => {
    if (questionId) {
      const res = await getQuestions(questionId);
      setCurrQuestion(res.data!);
    }
  };
  const doDate = async () => {
    const { data } = await getAllQuetions({
      ...searchParams,
      reviewStatus: searchParams.reviewStatus?.toString(),
    });
    setQuestions(data?.list ?? []);
    setTotal(data?.total ?? 0);
  };

  useEffect(() => {
    doDate();
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [questionId]);

  const doPassReview = async () => {
    const data = await reviewQuestion(questionId, REVIEW_STATUS_ENUM.PASS);
    message.success(data.message);
    await loadData();
    await doDate();
  };

  const doRejectReview = () => {
    setShowRejectModal(true);
  };

  const doEdit = async (info: { key: string }) => {
    // loadData
    switch (info.key) {
      case 'pass':
        await doPassReview();
        break;
      case 'reje':
        doRejectReview();
        break;
    }
  };

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col md={6} xs={24}>
          <Card
            title='?????????????????????????????????'
            extra={
              <LightFilter
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                collapse
                bordered
                labelAlign='left'
                initialValues={{
                  reviewStatus: REVIEW_STATUS_ENUM.REVIEWING.toString(),
                }}
                onFinish={async (values) => {
                  if (values?.tags?.length === 0) {
                    delete values?.tags;
                  }
                  setSearchParams({
                    ...values,
                    pageNum: 1,
                  });
                }}
              >
                <ProFormText name='title' label='?????????' />
                <ProFormSelect name='reviewStatus' label='????????????' valueEnum={REVIEW_STATUS_MAP} />
                <ProForm.Item label='??????' name='tags'>
                  <SelectTag placeholder='????????????' />
                </ProForm.Item>
              </LightFilter>
            }
          >
            <List<QuestionsType>
              rowKey='_id'
              // loading={loading}
              dataSource={questions}
              pagination={{
                pageSize: DEFAULT_PAGE_SIZE,
                current: searchParams.pageNum ?? 1,
                simple: true,
                total,
                showTotal() {
                  return `?????? ${total}`;
                },
                onChange(pageNum, pageSize) {
                  const params = {
                    ...searchParams,
                    pageNum,
                    pageSize,
                  };
                  setSearchParams(params);
                },
              }}
              renderItem={(item) => {
                const reviewStatusInfo = REVIEW_STATUS_MAP_INFO[item.reviewStatus];
                return (
                  <List.Item key={item._id}>
                    <List.Item.Meta
                      title={
                        <a
                          style={{ color: reviewStatusInfo.color }}
                          onClick={() => setQuestionId(item._id)}
                        >
                          {'?????????' + getQuestionTitle(item)}
                        </a>
                      }
                      description={new Date(item.create_time).toLocaleDateString()}
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card
            title={
              <>
                <Space split={<Divider type='vertical' />} wrap align='center'>
                  <span>???????????? / ??????</span>

                  {currQuestion?._id && (
                    <>
                      <span>{QUESTION_TYPE_ENUM[currQuestion?.type ?? 0]}</span>
                      <div>
                        <Tag color={QUESTION_DIFFICULTY_COLOR_ENUM[currQuestion?.difficulty || 0]}>
                          {QUESTION_DIFFICULTY_ENUM[currQuestion?.difficulty || 0]}
                        </Tag>
                        {currQuestion?.tags.map((tag: string) => {
                          return <Tag key={tag}>{tag}</Tag>;
                        })}
                      </div>
                    </>
                  )}
                </Space>
              </>
            }
            key={questionId}
            extra={
              currQuestion?._id && (
                <Space>
                  <Button type='primary' size='small' onClick={() => setCommentDrawerVisible(true)}>
                    ????????????
                  </Button>
                  {currQuestion?.reviewStatus !== 2 && (
                    <Dropdown
                      overlay={
                        <Menu
                          onClick={doEdit}
                          items={(() => {
                            const action = [{ key: 'pass', icon: <EditOutlined />, label: '??????' }];
                            if (currQuestion?.reviewStatus !== 3) {
                              action.push({ key: 'reje', icon: <DeleteOutlined />, label: '??????' });
                            }
                            return action;
                          })()}
                        />
                      }
                      arrow
                    >
                      <Space>
                        <MoreOutlined /> ??????
                      </Space>
                    </Dropdown>
                  )}
                </Space>
              )
            }
            actions={
              currQuestion?._id
                ? [
                    <Button
                      type='link'
                      icon={<EditOutlined />}
                      onClick={() => {
                        if (currQuestion?._id) {
                          history.push(
                            { pathname: `/editQuestion/${currQuestion?._id}` },
                            { auth: true },
                          );
                        }
                      }}
                    >
                      ??????
                    </Button>,
                    <Popconfirm
                      title='????????????????????????????????????'
                      onConfirm={async () => {
                        const res = await deleteQuestion(currQuestion?._id || '');
                        await doDate();
                        setCurrQuestion({} as any);
                        setQuestionId('');
                        message.success(res.message);
                      }}
                    >
                      <Button type='link' icon={<DeleteOutlined />}>
                        ??????
                      </Button>
                    </Popconfirm>,
                  ]
                : []
            }
          >
            {currQuestion?._id ? (
              <>
                <p style={{ marginBottom: 12 }}>
                  <Tag color={REVIEW_STATUS_MAP_INFO[currQuestion.reviewStatus].color}>
                    {REVIEW_STATUS_MAP_INFO[currQuestion.reviewStatus].text}
                  </Tag>
                  {currQuestion.reviewMessage && `???${currQuestion.reviewMessage}???`}
                </p>
                <QuestionDetailCard question={currQuestion} showReference showTitle />
              </>
            ) : (
              <b>???????????????</b>
            )}
          </Card>
        </Col>
        <Col md={6} xs={24}>
          <Card title='????????????' bodyStyle={{ paddingBottom: 12 }}>
            {currQuestion._id ? (
              <Descriptions column={1}>
                <Descriptions.Item label='?????????'>
                  <Avatar
                    src={currQuestion.userId?.avtar_url || defaultAvtar}
                    style={{ marginRight: 5 }}
                  />
                  {currQuestion.userId?.nickname}
                </Descriptions.Item>
                <Descriptions.Item label='?????????'>{currQuestion.viewNum}</Descriptions.Item>
                <Descriptions.Item label='?????????'>{currQuestion.commentNum}</Descriptions.Item>
                <Descriptions.Item label='?????????'>{currQuestion.favourNum}</Descriptions.Item>
                <Descriptions.Item label='????????????'>
                  {new Date(currQuestion.create_time).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label='????????????'>
                  {new Date(currQuestion.update_time).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label='????????????'>
                  {new Date(currQuestion.reviewTime).toLocaleString()}
                </Descriptions.Item>

                <Descriptions.Item label='????????????'>
                  {currQuestion.reviewMessage ?? '???'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              '?????????????????????????????????'
            )}
          </Card>
        </Col>
      </Row>
      <QuestionRejectModal
        visible={showRejectModal}
        questionId={questionId}
        onClose={async () => {
          setShowRejectModal(false);
        }}
        onSucceed={async (msg) => {
          const data = await reviewQuestion(questionId, REVIEW_STATUS_ENUM.REJECT, msg);
          message.success(data.message);
          await loadData();
          await doDate();
        }}
      />
      {currQuestion && (
        <Drawer
          title='????????????'
          placement='right'
          width='80%'
          contentWrapperStyle={{ maxWidth: 800 }}
          onClose={() => {
            setCommentDrawerVisible(false);
          }}
          visible={commentDrawerVisible}
        >
          <CommentList question={currQuestion} />
        </Drawer>
      )}
    </>
  );
};

export default MangeQuestion;
