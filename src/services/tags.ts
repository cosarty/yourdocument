import { request } from 'umi'

export type TagsType = {
  tags: string[],
  name: string
}

/**
 * 获取分类
 * @param payload {}
 * @returns API.TagAll
 */
export const getTags = async () => await request<API.TagAll>('/api/tags/getTags', {
  method: 'GET'
})

// 删除分类
export const delTags = async (payload: { name: string, tags?: string[] }) => await request<API.API_TYPE<null>>('/api/tags/delTags', {
  method: 'DELETE', data: payload
})

// 添加分类
export const updateTags = async (payload: { name: string, tags?: string[] }) => await request<API.API_TYPE<null>>('/api/tags/addTags', {
  method: 'PUT', data: payload
})



export default { getTags }
