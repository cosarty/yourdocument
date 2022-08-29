import { request } from 'umi'



/**
 * 获取分类
 * @param payload {}
 * @returns API.TagAll
 */
export const getTags = async () => await request<API.TagAll>('/api/tags/getTags', {
  method: 'GET'
})



export default { getTags }
