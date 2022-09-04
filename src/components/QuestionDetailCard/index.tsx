import RichTextViewer from '@/components/RichTextViewer';
import type { QuestionsType } from '@/services/question';
import { getQuestionDetail, getQuestionreRerence, getQuestionTitle } from '@/util/businessUtils';
import { Typography } from 'antd';
import React from 'react';
import './index.less';

interface QuestionDetailCardProps {
  question: QuestionsType;
  showReference?: boolean; // 展示解析
  showTitle?: boolean; // 展示标题
}

const QuestionDetailCard: React.FC<QuestionDetailCardProps> = (props) => {
  const { question = {} as QuestionsType, showReference = false, showTitle = true } = props;

  const questionTitle = getQuestionTitle(question);

  return (
    <div className='question-detail-card'>
      {showTitle && question.title && (
        <Typography.Title level={4} style={{ marginBottom: 16 }}>
          {questionTitle}
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
