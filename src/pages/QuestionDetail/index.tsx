/* eslint-disable react/jsx-key */
import {
  QUESTION_DIFFICULTY_COLOR_ENUM,
  QUESTION_DIFFICULTY_ENUM,
  QUESTION_TYPE_ENUM,
} from '@/constant/question';
import type { QuestionsType } from '@/services/question';
import { getQuestions } from '@/services/question';
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { useAccess, useModel, useParams } from '@umijs/max';
import { Card, Col, Divider, Dropdown, Menu, Row, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const QuestionDetail = () => {
  const [loading, setLoading] = useState(false);
  const [isFavour, setIsFavour] = useState<boolean>(false);
  const [favourLoading, setFavourLoading] = useState<boolean>(false);
  const [favourNum, setFavourNum] = useState<number>(0);
  const { initialState } = useModel('@@initialState');
  const { questionId } = useParams() as { questionId: string };
  const { currentUser } = initialState || {};
  const [qd, setQd] = useState<QuestionsType>();
  const { canLogin } = useAccess();

  const getQuestion = async (id: string) => {
    const q = await getQuestions(id);
    if (q.code === 200) {
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
    if (question) {
      setIsFavour(currentUser?.?.includes(question._id) ?? false);
      setFavourNum(question.favourNum ?? 0);
    }
  }, [currentUser, question]);

  // 是否允许编辑题目
  const canEdit = canLogin || qd?.userId === currentUser?._id;

  const getAction = () => {
    const actions = [
      <div onClick={() => {}}>
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
      <Helmet>{qd && <title>{qd?.title.substring(0, 40)} - 面试鸭</title>}</Helmet>
      <GridContent style={{ overflowX: 'hidden' }}>
        <Row gutter={[0, 24]} justify={'center'}>
          <Col xl={20} lg={24} xs={24}>
            <Card
              actions={getAction()}
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
              方式方式的
            </Card>
          </Col>
          <Col xl={20} lg={24} xs={24}>
            <Card title='评论区'>挂号费逗号分隔</Card>
          </Col>
        </Row>
      </GridContent>
    </HelmetProvider>
  );
};

export default QuestionDetail;
