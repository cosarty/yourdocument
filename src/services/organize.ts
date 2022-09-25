import { request } from '@umijs/max';
import type { QuestionsType } from './question';
import type { CurrentUser } from './users';

export type OrganizeType = {
  _id: string;
  name: string;
  flag: string; //邀请码
  isPublish: boolean; // 是否公开
  userId: CurrentUser; //组织的发起人
  papers: {
    papersId: QuestionsType;
    publish: boolean;
  }; // 组织试卷
  part: {
    user: CurrentUser;
    nickname: string;
    pass: boolean; // 是否通过组织
  }[];
  // 参与用户 用户昵称
  motto: string;
};

export const getSelfOrgnize = async () =>
  await request<API.API_TYPE<{ organizes: OrganizeType[]; user: CurrentUser }>>(
    '/api/organize/self',
    {
      method: 'GET',
    },
  );

export const createOrgnize = async (payload: { name: string; motto: string }) =>
  await request<API.API_TYPE<null>>('/api/organize/create', {
    method: 'POST',
    data: payload,
  });

export const deleteOrgnize = async (organizeId: string) =>
  await request<API.API_TYPE<null>>(`/api/organize/del/${organizeId}`, {
    method: 'DELETE',
  });
