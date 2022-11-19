import RichTextViewer from '@/components/RichTextViewer';
import { QUESTION_TYPE_ENUM } from '@/constant/question';
import type { QuestionsType } from '@/services/question';
import { getQuestionDetail, getQuestionreRerence } from '@/util/businessUtils';
import { Typography } from 'antd';
import React from 'react';
import './index.less';

interface QuestionDetailCardProps {
  question: QuestionsType;
  showIndex?: boolean;
  index?: number;
  showReference?: boolean; // 展示解析
  showTitle?: boolean; // 展示标题
  grad?: number;
}

const QuestionDetailCard: React.FC<QuestionDetailCardProps> = (props) => {
  const {
    question = {} as QuestionsType,
    showReference = false,
    showTitle = true,
    showIndex = false,
    index,
    grad,
  } = props;

  return (
    <div className='question-detail-card'>
      {showIndex && (
        <p style={{ fontWeight: 'bold', fontSize: 17 }}>
          {index}. {QUESTION_TYPE_ENUM[question.type]}({grad || 0}分)
        </p>
      )}
      {showTitle && question.title && (
        <Typography.Title level={4} style={{ marginBottom: 16 }}>
          <RichTextViewer htmlContent={question.title}></RichTextViewer>
        </Typography.Title>
      )}

      {[0, 1, 2].includes(question.type as number) && (
        <div style={{ fontSize: 15, marginTop: 16 }}>
          {Object.keys(question?.params?.options ?? {}).map((option, i) => {
            return (
              <p key={i} style={{ wordBreak: 'break-all' }}>
                {String.fromCharCode(65 + i)}：{Object.values(question?.params?.options ?? {})[i]}
              </p>
            );
          })}
        </div>
      )}
      <div style={{ marginTop: 16, display: showReference ? 'initial' : 'none' }}>
        <p style={{ fontSize: 15 }}>
          解析：{question.params?.answer || getQuestionreRerence(question)}
        </p>
        {getQuestionDetail(question) && <RichTextViewer htmlContent={question.detail} />}
      </div>
    </div>
  );
};

export default QuestionDetailCard;
