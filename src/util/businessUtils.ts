// import copy from 'copy-to-clipboard';
// import { WEB_HOST } from '@/constant';
// import { shareQuestion } from '@/services/question';
// import { message } from 'antd';
// import { history } from 'umi';
// import type { QuestionType } from '@/models/question';
// import { stringify } from 'querystring';
// import BraftEditor from 'braft-editor';
// import type { LevelType } from '@/constant/level';
// import { LEVEL_LIST } from '@/constant/level';
// import type { CurrentUser, SimpleUser } from '@/models/user';
import BraftEditor from 'braft-editor';
import type { QuestionsType } from '@/services/question';





/**
 * 获取题目显示详情
 * @param question
 */
export const getQuestionDetail = (question: QuestionsType): string => {

  // 没标题，用描述代替
  return BraftEditor.createEditorState(question.detail).toText().trim();
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
