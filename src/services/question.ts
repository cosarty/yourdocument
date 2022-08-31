import { request } from 'umi'

export type QuestionsType = {
  params?: {
    options?: {
      A?: string;
      B?: string;
      G?: string;
      E?: string;
      D?: string;
      F?: string;
      C?: string;
    };
    answer: 'C';
  };
  _id: String;
  difficulty: number;
  title: string;
  commentNum: number;
  detail: string;
  favourNum: number;
  isDelete?: boolean;
  type: number;
  reviewStatus: number;
  tags: string[];
  userId: {
    _id: string;
    nickname: string;
  };
  viewNum: number;
  create_time: Date;
  update_time: Date;
  reference?: string;
  reviewMessage?: string;
}

export const searchQuetions = async (payload: Payload.QuestionSearchParams) => await request<API.QuestionList<QuestionsType>>('/api/questions/search', {
  method: 'POST', data: payload
})



export const addQuestion = async (payload: any) => await request<API.API_TYPE<null>>('/api/questions/addQuestion', {
  method: 'POST', data: payload
})

// 获取题目详情
export


  export default {
    searchQuetions,
    addQuestion
  }