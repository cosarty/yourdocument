import {
  QUESTION_DIFFICULTY_ENUM,
  QUESTION_TYPE_ENUM,
  REVIEW_STATUS_MAP_INFO,
} from '@/constant/question';
import type { QuestionsType } from '@/services/question';
import { getQuestionDetail } from '@/util/businessUtils';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Button, Col, Divider, List, Popconfirm, Row, Space, Tag, Typography } from 'antd';
import React, { FC, useState } from 'react';
import RichTextViewer from '../RichTextViewer';
import styles from './index.less';
const { Title, Paragraph } = Typography;

interface QuestionItemProps {
  question: QuestionsType;
  showReview?: boolean; // 显示审核状态
  showEdit?: boolean; // 显示修改
  showActions?: boolean; // 展示操作栏
  onReload?: () => void;
  showReference?: boolean; // 展示解析
  target?: string;
}

const QuestionItem: FC<QuestionItemProps> = (props) => {
  const [favourLoading, setFavourLoading] = useState<boolean>(false);
  const [isFavour, setIsFavour] = useState<boolean>(false);
  const [favourNum, setFavourNum] = useState<number>(0);
  const {
    question = {} as QuestionsType,
    showReview,
    showEdit = true,
    showActions = true,
    onReload,
    showReference = true,
    target = '_blank',
  } = props;

  const IconText = ({ icon, text, onClick = () => {}, danger = false, loading = false }) => (
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
    <List.Item>
      <Link to={`/qd/${question._id}`} target={target}>
        <Title
          level={5}
          ellipsis={{ rows: 2 }}
          style={{ marginBottom: 16 }}
          className='question-item-title'
        >
          {question.title}
        </Title>
      </Link>
      <Paragraph ellipsis={{ rows: 2 }} style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: 15 }}>
        {getQuestionDetail(question)}
      </Paragraph>
      {showReference && question.reference && (
        <>
          <p>解析：</p>
          <div style={{ fontSize: 15 }}>
            <RichTextViewer htmlContent={question.reference} />
          </div>
        </>
      )}

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
          <span>{QUESTION_TYPE_ENUM[question?.type ?? 0]}题</span>
          <span>{QUESTION_DIFFICULTY_ENUM[question.difficulty ?? 0]}</span>
          {question.update_time && <span>{new Date(question.update_time).toLocaleDateString}</span>}
        </Space>
      </div>
      {showActions && (
        <Row justify='space-between' align='middle'>
          <Col>
            <Space size={16} className='base-btn-group'>
              <a href={'/'} target='_blank' rel='noreferrer'>
                <IconText icon={EyeOutlined} text={question.viewNum} />
              </a>
              <IconText
                icon={isFavour ? StarFilled : StarOutlined}
                text={question.favourNum}
                loading={favourLoading}
                onClick={() => {}}
              />
              <a href={'/'} target='_blank' rel='noreferrer'>
                <IconText icon={MessageOutlined} text={question.commentNum} />
              </a>

              {
                // 没有人回答才允许修改
                showEdit && !question.commentNum && (
                  <IconText icon={EditOutlined} text='修改' onClick={() => {}} />
                )
              }
              {
                // 没有人回答才允许删除
                showEdit && !question.commentNum && (
                  <Popconfirm title='确认删除么，操作无法撤销' onConfirm={() => {}}>
                    <IconText icon={DeleteOutlined} danger={true} text='删除' onClick={() => {}} />
                  </Popconfirm>
                )
              }
            </Space>
          </Col>
        </Row>
      )}
    </List.Item>
  );
};

export default QuestionItem;
