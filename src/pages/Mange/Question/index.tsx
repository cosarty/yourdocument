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
import { deleteQuestion, getAllQuetions, getQuestions, QuestionsType } from '@/services/question';
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

const MangeQuestion = () => {
  const [total, setTotal] = useState<number>(0);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionsType[]>([]);

  const [questionId, setQuestionId] = useState<string>('');
  const [currQuestion, setCurrQuestion] = useState<QuestionsType>({} as any);
  const [commentDrawerVisible, setCommentDrawerVisible] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useState<Payload.QuestionSearchParams>({
    reviewStatus: REVIEW_STATUS_ENUM.REVIEWING,
    pageSize: 10,
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

  const doPassReview = () => {
    setSubmitting(true);
    //   reviewQuestion(questionId, form.getFieldValue('score'), REVIEW_STATUS_ENUM.PASS)
    //     .then((res) => {
    //       if (res) {
    //         message.success('已通过');
    //       } else {
    //         message.error('操作失败');
    //       }
    //     })
    //     .finally(() => setSubmitting(false));
    // };
  };

  const doRejectReview = () => {
    setShowRejectModal(true);
  };

  const doEdit = async (info: { key: string }) => {
    // loadData
    switch (info.key) {
      case 'pass':
        history.push({ pathname: `/editQuestion/${qd?._id}` }, { auth: true });
        break;
      case 'reject':
        const res = await deleteQuestion(qd?._id || '');
        message.success(res.message);
        history.replace('/');
        break;
    }
  };

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col md={5} xs={24}>
          <Card
            title='题目列表（点右边筛选）'
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
                  console.log('values: ', values);
                  if (values?.tags?.length === 0) {
                    delete values?.tags;
                  }
                  setSearchParams({
                    ...values,
                    pageNum: 1,
                  });
                }}
              >
                <ProFormText name='name' label='题目名' />
                <ProFormSelect name='reviewStatus' label='审核状态' valueEnum={REVIEW_STATUS_MAP} />
                <ProForm.Item label='标签' name='tags'>
                  <SelectTag placeholder='标签搜索' />
                </ProForm.Item>
              </LightFilter>
            }
          >
            <List<QuestionsType>
              rowKey='_id'
              // loading={loading}
              dataSource={questions}
              pagination={{
                pageSize: 10,
                current: searchParams.pageNum ?? 1,
                showSizeChanger: false,
                showQuickJumper: true,
                total,
                showTotal() {
                  return `总数 ${total}`;
                },
                onChange(pageNum) {
                  const params = {
                    ...searchParams,
                    pageNum,
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
                          {'题目：' + getQuestionTitle(item)}
                        </a>
                      }
                      description={new Date(item._createTime).toLocaleDateString()}
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col md={13} xs={24}>
          <Card
            title={
              <>
                <Space split={<Divider type='vertical' />} wrap align='center'>
                  <span>题目信息 / 修改</span>

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
                    查看回答
                  </Button>
                  {currQuestion?.reviewStatus !== 2 && (
                    <Dropdown
                      overlay={
                        <Menu
                          onClick={doEdit}
                          items={[
                            { key: 'pass', icon: <EditOutlined />, label: '通过' },
                            { key: 'reje', icon: <DeleteOutlined />, label: '驳回' },
                          ]}
                        />
                      }
                      arrow
                    >
                      <Space>
                        <MoreOutlined /> 操作
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
                      编辑
                    </Button>,
                    <Popconfirm
                      title='确认删除么，操作无法撤销'
                      onConfirm={async () => {
                        const res = await deleteQuestion(currQuestion?._id || '');
                        await doDate();
                        setCurrQuestion({} as any);
                        setQuestionId('');
                        message.success(res.message);
                      }}
                    >
                      <Button type='link' icon={<DeleteOutlined />}>
                        删除
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
                  {currQuestion.reviewMessage && `（${currQuestion.reviewMessage}）`}
                </p>
                <QuestionDetailCard question={currQuestion} showReference showTitle />
              </>
            ) : (
              <b>请选择题目</b>
            )}
          </Card>
        </Col>
        <Col md={6} xs={24}>
          <Card title='题目信息' bodyStyle={{ paddingBottom: 12 }}>
            {currQuestion._id ? (
              <Descriptions column={1}>
                <Descriptions.Item label='推荐人'>
                  <Avatar
                    src={currQuestion.userId?.avtar_url || defaultAvtar}
                    style={{ marginRight: 5 }}
                  />
                  {currQuestion.userId?.nickname}
                </Descriptions.Item>
                <Descriptions.Item label='浏览数'>{currQuestion.viewNum}</Descriptions.Item>
                <Descriptions.Item label='回答数'>{currQuestion.commentNum}</Descriptions.Item>
                <Descriptions.Item label='收藏数'>{currQuestion.favourNum}</Descriptions.Item>
                <Descriptions.Item label='创建时间'>
                  {new Date(currQuestion.create_time).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label='修改时间'>
                  {new Date(currQuestion.update_time).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label='审核时间'>
                  {new Date(currQuestion.reviewStatus).toLocaleString()}
                </Descriptions.Item>

                <Descriptions.Item label='审核信息'>
                  {currQuestion.reviewMessage ?? '无'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              '请在最左侧列表点击题目'
            )}
          </Card>
        </Col>
      </Row>
      <QuestionRejectModal
        visible={showRejectModal}
        questionId={questionId}
        onClose={() => setShowRejectModal(false)}
      />
      {currQuestion && (
        <Drawer
          title='回答列表'
          placement='right'
          width='80%'
          contentWrapperStyle={{ maxWidth: 800 }}
          onClose={() => setCommentDrawerVisible(false)}
          visible={commentDrawerVisible}
        >
          <CommentList question={currQuestion} />
        </Drawer>
      )}
    </>
  );
};

export default MangeQuestion;
