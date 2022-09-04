import CommentList from '@/components/CommentList';
import QuestionRejectModal from '@/components/QuestionRejectModal';
import SelectTag from '@/components/SelectTag';
import { REVIEW_STATUS_ENUM, REVIEW_STATUS_MAP, REVIEW_STATUS_MAP_INFO } from '@/constant/question';
import { QuestionsType } from '@/services/question';
import { getQuestionTitle } from '@/util/businessUtils';
import { LightFilter, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Card, Col, Drawer, Form, List, message, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import BraftEditor from 'braft-editor';
import { useEffect, useState } from 'react';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const MangeQuestion = () => {
  const [total, setTotal] = useState<number>(0);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<Partial<QuestionsType>>({});

  const [questionId, setQuestionId] = useState<string>('');
  const [currQuestion, setCurrQuestion] = useState<QuestionsType>();
  const [commentDrawerVisible, setCommentDrawerVisible] = useState<boolean>(false);
  const [similarSearchParams, setSimilarSearchParams] = useState<Payload.QuestionSearchParams>();

  const [form] = Form.useForm();

  const access = useAccess();

  const [searchParams, setSearchParams] = useState<Payload.QuestionSearchParams>({
    reviewStatus: REVIEW_STATUS_ENUM.REJECT,
    pageSize: 10,
  });

  const loadData = async () => {
    if (questionId) {
      form.resetFields();
      // const res = await getQuestion(questionId);
      const res = false;
      if (!res) {
        message.error('加载失败，请刷新重试');
        return;
      }
      setCurrQuestion(res);
      form.setFieldsValue(res);
    }
  };

  useEffect(() => {
    // searchQuestionsByPage(searchParams)
    // .then((res) => {
    //   setQuestions(res.data);
    //   setTotal(res.total);
    // })
    // .finally(() => {
    //   setLoading(false);
    // });
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [questionId]);

  /**
   * 相似检测
   * @param text
   */
  const doSimilarSearch = async (text: string) => {
    setSimilarSearchParams({
      title: text,
      reviewStatus: REVIEW_STATUS_ENUM.PASS,

      type: form.getFieldValue('type'),
    });
  };

  const doSubmit = async (values: Record<string, any>) => {
    if (!BraftEditor.createEditorState(values.reference)?.toText()) {
      values.reference = '';
    }
    setSubmitting(true);
    // const res = await updateQuestion(questionId, values);
    // if (res) {
    //   message.success('更新成功');
    // } else {
    //   message.error('更新失败');
    // }
    setSubmitting(false);
  };

  const onValuesChange = (changedValues: Record<string, any>, allValues: Record<string, any>) => {
    setFormValue(allValues);
  };

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

  const questionFilter = (
    <LightFilter
      collapse
      bordered
      labelAlign='left'
      initialValues={{
        reviewStatus: REVIEW_STATUS_ENUM.REVIEWING.toString(),
      }}
      onFinish={async (values) => {
        if (values.reviewStatus) {
          values.reviewStatus = parseInt(values.reviewStatus, 10);
        }
        setSearchParams({ ...searchParams, ...values, pageNum: 1 });
      }}
    >
      <ProFormText name='name' label='题目名' />
      <ProFormSelect name='reviewStatus' label='审核状态' valueEnum={REVIEW_STATUS_MAP} />
      <FormItem label='与标签' name='tags'>
        <SelectTag />
      </FormItem>
    </LightFilter>
  );

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col md={5} xs={24}>
          <Card title='题目列表（点右边筛选）' extra={questionFilter}>
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
            title='题目信息 / 修改'
            key={questionId}
            extra={
              currQuestion && (
                <Button type='primary' size='small' onClick={() => setCommentDrawerVisible(true)}>
                  查看回答
                </Button>
              )
            }
          />
        </Col>
        {/* <Col md={6} xs={24}> */}
        {/* <Card title='题目信息' bodyStyle={{ paddingBottom: 12 }}>
          {currQuestion ? (
            <Descriptions column={1}>
              <Descriptions.Item label='推荐人'>
                <Avatar src={user?.avatarUrl || DEFAULT_AVATAR} style={{ marginRight: 5 }} />
                {user?.nickName}
              </Descriptions.Item>
              <Descriptions.Item label='浏览数'>{currQuestion.viewNum}</Descriptions.Item>
              <Descriptions.Item label='回答数'>{currQuestion.commentNum}</Descriptions.Item>
              <Descriptions.Item label='收藏数'>{currQuestion.favourNum}</Descriptions.Item>
              <Descriptions.Item label='创建时间'>
                {formatDateTimeStr(currQuestion._createTime)}
              </Descriptions.Item>
              <Descriptions.Item label='修改时间'>
                {formatDateTimeStr(currQuestion._updateTime)}
              </Descriptions.Item>
              <Descriptions.Item label='审核时间'>
                {formatDateTimeStr(currQuestion.reviewTime)}
              </Descriptions.Item>
              <Descriptions.Item label='发布时间'>
                {formatDateTimeStr(currQuestion.publishTime)}
              </Descriptions.Item>
              <Descriptions.Item label='审核信息'>{currQuestion.reviewMessage}</Descriptions.Item>
            </Descriptions>
          ) : (
            '请在最左侧列表点击题目'
          )}
        </Card> */}
        {/* </Col> */}
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
