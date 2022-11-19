import type { QuestionsType } from '@/services/question';
import BraftEditor from 'braft-editor';

/**
 * 获取题目显示详情
 * @param question
 */
export const getQuestionDetail = (question: QuestionsType): string => {
  // crossOrigin', 'anonymous'
  // 没标题，用描述代替
  return BraftEditor.createEditorState(question.detail).toText().trim();
};

export const getQuestionTitle = (question: QuestionsType): string => {
  // 没标题，用描述代替
  return BraftEditor.createEditorState(question.title).toText().trim();
};
export const getQuestionreRerence = (question: QuestionsType): string => {
  // 没标题，用描述代替
  return BraftEditor.createEditorState(question.reference).toText().trim();
};

// /**
//  * 分享题目
//  */
// export const doShareQuestion = async (question?: QuestionType) => {
//   // 复制到剪切板，分享数 +1
//   if (question && question._id) {
//     let questionTitle = getQuestionTitle(question);
//     if (questionTitle.length > 40) {
//       questionTitle = questionTitle.substring(0, 40) + '...';
//     }
//     copy(`我在面试鸭发现了这道题『 ${questionTitle} 』💎 快来看看 ${WEB_HOST}/qd/${question._id}`);
//     shareQuestion(question._id);
//     message.success('链接已复制，感谢分享！');
//   }
// };
