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
export const delTags = async (payload: { name: string, tags?: string[] }) => await request<API.TagAll>('/api/tags/getTags', {
  method: 'PUT', data: payload
})

// 添加分类
export const updateTags = async ({ name, tags = [] }: { name: string, tags: string[] }) => await request<API.TagAll>('/api/tags/getTags', {
  method: 'DELETE', data: { name, tags }
})



export default { getTags }
