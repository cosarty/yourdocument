import { request } from 'umi';

export type QuestionsType = {
  params?: {
    options?:
      | {
          A?: string;
          B?: string;
          G?: string;
          E?: string;
          D?: string;
          F?: string;
          C?: string;
        }
      | string[];
    answer: string | string[];
  };
  _id: string;
  difficulty: number | string;
  title: string;
  commentNum: number;
  detail: string;
  favourNum: number;
  isDelete?: boolean;
  type: number | string;
  reviewStatus: number;
  tags: string[];
  userId: {
    _id: string;
    nickname: string;
    avtar_url: string;
  };
  viewNum: number;
  create_time: Date;
  update_time: Date;
  reference?: string;
  reviewMessage?: string;
  reviewTim: Date;
  isPrivate: boolean;
  [key: string]: any;
};

export const searchQuetions = async (payload: any) =>
  await request<API.QuestionList<QuestionsType>>('/api/questions/search', {
    method: 'POST',
    data: payload,
  });

// 管理员获取题目列表
export const getAllQuetions = async (payload: Payload.QuestionSearchParams) =>
  await request<API.QuestionList<QuestionsType>>('/api/questions/getAll', {
    method: 'POST',
    data: payload,
  });

export const addQuestion = async (payload: any) =>
  await request<API.API_TYPE<null>>('/api/questions/addQuestion', {
    method: 'POST',
    data: payload,
  });

// 获取题目详情
export const getQuestions = async (qutionsId: string) =>
  await request<API.API_TYPE<QuestionsType>>(`/api/questions/get/${qutionsId}`, {
    method: 'GET',
  });

// 收藏题目
// tslint:disable-next-line: max-line-length
export const favourQuestion = async (qutionsId: string) =>
  await request<API.API_TYPE<{ mit: number }>>(`/api/questions/favour/${qutionsId}`, {
    method: 'PUT',
  });
export const viewQuestion = async (qutionsId: string) =>
  await request<API.API_TYPE<null>>(`/api/questions/view/${qutionsId}`, {
    method: 'PUT',
  });

export const deleteQuestion = async (qutionsId: string) =>
  await request<API.API_TYPE<null>>(`/api/questions/delete/${qutionsId}`, {
    method: 'DELETE',
  });

export const updateQuestion = async (qutionsId: string, payload: any) =>
  await request<API.API_TYPE<QuestionsType>>(`/api/questions/updateQuestion/${qutionsId}`, {
    method: 'PUT',
    data: payload,
  });

// 获取收藏列表
export const getfavourQuestion = async (payload?: { tags?: string[] }) =>
  await request<API.API_TYPE<QuestionsType[]>>(`/api/questions/getfavour`, {
    method: 'POST',
    data: payload,
  });

// 获取自己上传的题目
export const searchOriginQuestion = async (payload?: any) =>
  await request<API.QuestionList<QuestionsType>>(`/api/questions/search/origin`, {
    method: 'POST',
    data: payload,
  });

// 获取浏览记录
export const searchHistoryQuestion = async (payload?: any) =>
  await request<API.QuestionList<QuestionsType>>(`/api/questions/history`, {
    method: 'post',
    data: payload,
  });

// 审核题目

export const reviewQuestion = async (qutionsId: string, reviewStatus: number, message?: string) =>
  await request<API.QuestionList<QuestionsType>>(`/api/questions/review/${qutionsId}`, {
    method: 'PUT',
    data: { reviewStatus: reviewStatus + '', reviewMessage: message },
  });

export const updateQuestionPeivate = async (qutionsId: string) =>
  await request<API.API_TYPE<{ isPrivate: boolean }>>(`/api/questions/updatePeivate/${qutionsId}`, {
    method: 'PUT',
  });

export default {
  searchQuetions,
  addQuestion,
  getQuestions,
  favourQuestion,
  viewQuestion,
};
