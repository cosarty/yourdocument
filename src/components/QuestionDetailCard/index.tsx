import RichTextViewer from '@/components/RichTextViewer';
import { QUESTION_TYPE_ENUM } from '@/constant/question';
import type { QuestionsType } from '@/services/question';
import { getQuestionDetail, getQuestionreRerence, getQuestionTitle } from '@/util/businessUtils';
import { Typography } from 'antd';
import BraftEditor from 'braft-editor';
import React from 'react';
import './index.less';

interface QuestionDetailCardProps {
  question: QuestionsType;
  showReference?: boolean; // 展示解析
  showTitle?: boolean; // 展示标题
  index?: number; // 题号
}

const QuestionDetailCard: React.FC<QuestionDetailCardProps> = (props) => {
  const { question = {} as QuestionsType, showReference = false, showTitle = true, index } = props;

  const textQuestionDetail = BraftEditor.createEditorState(question.detail).toText().trim();
  const questionTitle = getQuestionTitle(question);

  return (
    <div className='question-detail-card'>
      {showTitle && question.title && (
        <Typography.Title level={4} style={{ marginBottom: 16 }}>
          {questionTitle}
        </Typography.Title>
      )}
      {(!showTitle || textQuestionDetail !== question.title?.trim()) && (
        <div style={{ fontSize: 15 }}>
          {index && (
            <p className='question-item-title' style={{ fontWeight: 'bold' }}>
              {index}. {QUESTION_TYPE_ENUM[question.type]}题
            </p>
          )}
          <RichTextViewer htmlContent={question.detail} />
        </div>
      )}
      {[0, 1, 2].includes(question.type) && (
        <div style={{ fontSize: 15, marginTop: 16 }}>
          {Object.keys(question?.params?.options ?? {}).map((option, i) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
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
