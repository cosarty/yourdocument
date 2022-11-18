import { request } from '@umijs/max';
import type { PaperType } from './paper';

import type { CurrentUser } from './users';

export type SimpleUser = {
  user: CurrentUser;
  pass: boolean;
};

export type OrganizeType = {
  _id: string;
  name: string;
  flag: string; //邀请码
  isPublish: boolean; // 是否公开
  userId: CurrentUser; //组织的发起人
  part: SimpleUser[];
  // 参与用户 用户昵称
  motto: string;
  papers?: PaperType[];
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

export const editOrgnize = async (organizeId: string, payload: { name: string; motto: string }) =>
  await request<API.API_TYPE<null>>(`/api/organize/edit/${organizeId}`, {
    method: 'PUT',
    data: payload,
  });

// /api/organize/viewPaper
// 获取试卷详情
export const viewPaper = async (organizeId: string) =>
  await request<API.API_TYPE<PaperType[]>>(`/api/organize/viewPaper`, {
    method: 'GET',
    params: {
      organizeId,
    },
  });
// 获取人员详情
export const viewUsers = async (organizeId: string) =>
  await request<API.API_TYPE<OrganizeType['part']>>(`/api/organize/users/${organizeId}`, {
    method: 'GET',
  });

// 开放试卷 /organize/publishpaper/{organizeId}
export const publishPaper = async (organizeId: string, paperId: string) =>
  await request<API.API_TYPE<OrganizeType['part']>>(`/api/organize/publishpaper/${organizeId}`, {
    method: 'PUT',
    data: {
      paperId,
    },
  });
// 申请组织
export const applyOrg = async (flag: string) =>
  await request<API.API_TYPE<{ ret: number }>>(`/api/organize/apply`, {
    method: 'POST',
    data: {
      flag,
    },
  });
// 申请列表
export const applyList = async (organizeId: string) =>
  await request<API.API_TYPE<{ part: CurrentUser[]; _id: string }>>(
    `/api/organize/applyList/${organizeId}`,
    {
      method: 'GET',
    },
  );
