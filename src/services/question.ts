import { request } from 'umi'


export const searchQuetions = async (payload: Payload.QuestionSearchParams) => await request<API.QuestionList>('/api/questions/search', {
  method: 'POST', data: payload
})


export default {
  searchQuetions
}