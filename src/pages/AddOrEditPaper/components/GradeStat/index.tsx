import { QUESTION_TYPE_ENUM } from '@/constant/question';
import { ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Statistic } from 'antd';
import { useEffect, useMemo, useState } from 'react';

type QuestionType = Record<keyof typeof QUESTION_TYPE_ENUM, number>;

const defaultCheckType = Object.keys(QUESTION_TYPE_ENUM).reduce(
  (p, r) => ({ ...p, [r]: 0 }),
  {} as QuestionType,
);

const GradeStat = () => {
  const { checkQuetion } = useModel('checkQuestions');
  const [questionType, setQuestionType] = useState<QuestionType>(defaultCheckType);
  useEffect(() => {
    const { ...copyType } = defaultCheckType;
    for (const q of checkQuetion) {
      copyType[q.question.type]++;
    }
    setQuestionType(copyType);
  }, [checkQuetion]);

  const totalQ = useMemo(
    () => Object.keys(questionType).reduce((c, r) => c + questionType[r], 0),
    [questionType],
  );

  const totalGrade = useMemo(
    () => checkQuetion.reduce((c, { grade }) => c + grade, 0),
    [checkQuetion],
  );
  return (
    <ProCard.Group
      direction={'row'}
      title={`总题数${totalQ}`}
      style={{ marginBottom: 20 }}
      extra={`总分:${totalGrade}`}
    >
      {Object.keys(questionType).map((k, i) => (
        <ProCard key={i}>
          <Statistic title={QUESTION_TYPE_ENUM[k]} value={questionType[k]} />
        </ProCard>
      ))}
    </ProCard.Group>
  );
};

export default GradeStat;
