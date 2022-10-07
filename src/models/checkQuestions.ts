import { useState } from 'react';

export type CheckQuestionType = { grade: number; question: string };

const UseCheckQuestions = () => {
  const [checkQuetion, setCheckQuetion] = useState<CheckQuestionType[]>([]);

  const addQuestions = (question: CheckQuestionType) => {
    // 判断题目是否选中
    const isover = checkQuetion.find((q) => q.question === question.question);
    if (!isover) return setCheckQuetion([...checkQuetion, question]);
    isover.grade = question.grade;
    return setCheckQuetion([...checkQuetion]);
  };

  return { addQuestions, checkQuetion };
};

export default UseCheckQuestions;
