import type { QuestionsType } from '@/services/question';
import { useState } from 'react';

export type CheckQuestionType = { grade: number; question: QuestionsType; index?: number };

const UseCheckQuestions = () => {
  const [checkQuetion, setCheckQuetion] = useState<CheckQuestionType[]>([]);

  const editGrade = (question: { _id: string; grade: number }) => {
    // 修改分数
    const isover = checkQuetion.find((q) => q.question._id === question._id);
    if (!isover) return;
    isover.grade = question.grade;
    setCheckQuetion([...checkQuetion]);
  };

  const editQuestion = (question: CheckQuestionType) => {
    const isover = checkQuetion.findIndex((q) => q.question._id === question.question._id);
    if (isover !== -1)
      setCheckQuetion(
        [...checkQuetion.filter((_, i) => i !== isover)].map((p, i) => ({ ...p, index: i })),
      );
    else setCheckQuetion([...checkQuetion, { ...question, index: checkQuetion.length + 1 }]);
  };

  const initCheckQuestion = (questions?: Pick<CheckQuestionType, 'grade' | 'question'>[]) => {
    if (questions) setCheckQuetion([...questions.map((p, i) => ({ ...p, index: i }))]);
  };
  return { editGrade, checkQuetion, editQuestion, setCheckQuetion, initCheckQuestion };
};

export default UseCheckQuestions;
