import {
  QUESTION_DIFFICULTY_ENUM,
  QUESTION_TYPE_ENUM,
  REVIEW_STATUS_MAP_INFO,
} from '@/constant/question';
import type { QuestionsType } from '@/services/question';
import { deleteQuestion, favourQuestion } from '@/services/question';
import { getQuestionreRerence, getQuestionTitle } from '@/util/businessUtils';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { history, Link, useAccess, useModel } from '@umijs/max';
import { Button, Col, Divider, List, message, Popconfirm, Row, Space, Tag, Typography } from 'antd';
import type { FC} from 'react';
import React, { useEffect, useState } from 'react';
import ControlPrivateQuestionL from '../ControlPrivateQuestion';
import styles from './index.less';

const { Title, Paragraph } = Typography;

interface QuestionItemProps {
  question: QuestionsType;
  showReview?: boolean; // 显示审核状态
  showEdit?: boolean; // 显示修改
  showActions?: boolean; // 展示操作栏
  onReload?: () => void;
  target?: string;
  showPricateState?: boolean;
  isSelect?: boolean;
}

const QuestionItem: FC<QuestionItemProps> = (props) => {
  const [favourLoading, setFavourLoading] = useState<boolean>(false);
  const [isFavour, setIsFavour] = useState<boolean>(false);
  const [favourNum, setFavourNum] = useState<number>(0);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { getUser } = useModel('user');
  const { canLogin, canAdmin } = useAccess();
  const {
    question = {} as QuestionsType,
    showReview,
    showActions = true,
    onReload,
    showEdit = false,
    showPricateState = false,
    isSelect = false,
  } = props;

  const { checkQuetion, editQuestion } = useModel('checkQuestions');

  const doFavour = async () => {
    if (!question?._id || favourLoading) {
      return;
    }

    setFavourLoading(true);
    const res = await favourQuestion(question?._id || '');
    setFavourLoading(false);

    if (res.code === 202) {
      // tslint:disable-next-line: no-non-null-assertion
      const mit = res!.data?.mit || 0;
      setFavourNum(favourNum + mit);

      setIsFavour(true);
      message.success(res.message);

      await getUser();
    } else {
      message.error('操作失败');
    }
  };

  // 初始化收藏
  useEffect(() => {
    if (question) {
      setIsFavour(currentUser?.favours?.includes(question?._id || '') ?? false);
    }
  }, [currentUser, question]);
  // 初始化收藏
  useEffect(() => {
    if (question) {
      setFavourNum(question.favourNum ?? 0);
    }
  }, [question]);

  const doDelete = async () => {
    const res = await deleteQuestion(question._id);
    if (res) {
      message.success('删除成功');
      if (onReload) {
        onReload();
      }
    } else {
      message.error('删除失败');
    }
  };

  const isCheck = () => !checkQuetion.find((q) => q.question._id === question._id);

  const editCheckQuestion = (q: QuestionsType) => {
    editQuestion({ question: q, grade: 0 });
  };

  const IconText = ({ icon, text, onClick = () => {}, danger = false, loading = false }: any) => (
    <Button
      className={styles['icon-text']}
      size='small'
      danger={danger}
      icon={React.createElement(icon)}
      onClick={onClick}
      loading={loading}
    >
      <span>{text}</span>
    </Button>
  );

  return (
    <List.Item
      extra={
        showPricateState && (
          <ControlPrivateQuestionL
            qustionId={question._id}
            value={question.isPrivate}
            onChange={() => {
              onReload?.();
            }}
          />
        )
      }
    >
      <Title
        level={5}
        ellipsis={{ rows: 2 }}
        style={{ marginBottom: 16 }}
        className={styles['question-item-title']}
        onClick={() => {
          if (question.reviewStatus !== 2) {
            message.warn('题目未审核通过');
            return;
          }
          history.push(`/qd/${question._id}`);
        }}
      >
        {getQuestionTitle(question)}
      </Title>

      <Paragraph ellipsis={{ rows: 2 }} style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: 15 }}>
        {getQuestionreRerence(question)}
      </Paragraph>
      <Space size={10} style={{ marginBottom: 10 }}>
        {question.tags.map((tag: string) => {
          return <Tag key={tag}>{tag}</Tag>;
        })}
      </Space>
      {showReview && (
        <p style={{ marginBottom: 12 }}>
          <Tag color={REVIEW_STATUS_MAP_INFO[question.reviewStatus].color}>
            {REVIEW_STATUS_MAP_INFO[question.reviewStatus].text}
          </Tag>
          {question.reviewMessage && `（${question.reviewMessage}）`}
        </p>
      )}
      <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>
        <Space split={<Divider type='vertical' />}>
          <span>{QUESTION_TYPE_ENUM[question?.type ?? 0]}</span>
          <span>{QUESTION_DIFFICULTY_ENUM[question.difficulty ?? 0]}</span>
          {question.update_time && (
            <span>{new Date(question.update_time).toLocaleDateString()}</span>
          )}
        </Space>
      </div>
      {
        <Row
          justify={showActions && question.reviewStatus === 2 ? 'space-between' : 'end'}
          align='middle'
        >
          {showActions && question.reviewStatus === 2 && (
            <Col>
              <Space size={16}>
                <Link to={`/qd/${question._id}`} target={'_blank'}>
                  <IconText icon={EyeOutlined} text={question.viewNum} />
                </Link>
                {canLogin && (
                  <IconText
                    icon={isFavour ? StarFilled : StarOutlined}
                    text={favourNum}
                    loading={favourLoading}
                    onClick={() => {
                      doFavour();
                    }}
                  />
                )}
                <a href={'/'} target='_blank' rel='noreferrer'>
                  <IconText icon={MessageOutlined} text={question.commentNum} />
                </a>
              </Space>
            </Col>
          )}
          {isSelect && !showEdit && (
            <Tag
              color={isCheck() ? '#3b5999' : '#cd201f'}
              onClick={() => {
                editCheckQuestion(question);
              }}
            >
              {isCheck() ? '选题' : '移出'}
            </Tag>
          )}
          {(question.userId._id === currentUser?._id || canAdmin) && showEdit && (
            <Col>
              <Space size={10}>
                {question.reviewStatus !== 3 && (
                  <Link to={`/editQuestion/${question._id}`} state={{ auth: true }}>
                    <IconText icon={EditOutlined} text='修改' />
                  </Link>
                )}

                <Popconfirm
                  title='确认删除么，操作无法撤销'
                  onConfirm={() => {
                    doDelete();
                  }}
                >
                  <IconText icon={DeleteOutlined} danger={true} text='删除' />
                </Popconfirm>
              </Space>
            </Col>
          )}
        </Row>
      }
    </List.Item>
  );
};

export default QuestionItem;
