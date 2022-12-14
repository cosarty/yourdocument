import { request } from '@umijs/max';
import type { PaperType } from './paper';
import type { QuestionsType } from './question';

import type { CurrentUser } from './users';

export type SimpleUser = {
  user: CurrentUser | string;
  pass: boolean;
};

export type OrganizeType = {
  _id: string;
  name: string;
  flag: string; //邀请码
  isPublish: boolean; // 是否公开
  userId: CurrentUser | string; //组织的发起人
  part: SimpleUser[];
  // 参与用户 用户昵称
  motto: string;
  papers?: PaperType[];
};
export type PaperInfo = {
  paper?: {
    _id: string;
    name: string;
    detail: string;
    isDelete: false;
    questions: {
      question: string;
      grade: number;
    }[];
    points: number;
  };
  questionInfo?: QuestionsType[];
};

export const getSelfOrgnize = async () =>
  await request<API.API_TYPE<{ organizes: OrganizeType[]; user: CurrentUser }>>(
    '/api/organize/self',
    {
      method: 'GET',
    },
  );
// /api/organize/get
export const getOrgnize = async () =>
  await request<API.API_TYPE<{ organizes: OrganizeType[]; user: CurrentUser }[]>>(
    '/api/organize/get',
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

export const passOg = async (userId: string, payload: { organizeId: string; isPass: boolean }) =>
  await request<API.API_TYPE<null>>(`/api/organize/pass/${userId}`, {
    method: 'PUT',
    data: payload,
  });

// 踢出组织
export const kickoutOg = async (organizeId: string, payload: { userId: string }) =>
  await request<API.API_TYPE<null>>(`/api/organize/kickout/${organizeId}`, {
    method: 'PUT',
    data: payload,
  });
// 查看组织试卷
export const getPaperOgInfo = async (organizeId: string, paperId: string) =>
  await request<API.API_TYPE<PaperInfo>>(`/api/organize/getPaper`, {
    method: 'GET',
    params: { organizeId, paperId },
  });
