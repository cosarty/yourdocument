import { request } from '@umijs/max';
import type { QuestionsType } from './question';

export type PaperType = {
  papersId: { detail: string; _id: string; name: string };
  publish: boolean;
};

export type SourcePaperType = {
  _id: string;
  name: string;
  detail: string;
  create_time: string;
  questions: { _id: string; grade: number }[];
  organize: { _id: string; name: number }[];
};

export type PaperPayloadType = {
  name: string;
  detail: string;
  questions: { grade: number; question: string }[];
};

export const cratePaper = async (payload: PaperPayloadType) =>
  await request<API.API_TYPE<null>>(`/api/paper/create`, {
    method: 'POST',
    data: payload,
  });

export const getMyPaper = async () =>
  await request<API.API_TYPE<SourcePaperType[]>>(`/api/paper/get/myPaper`, {
    method: 'GET',
  });

// 获取试卷详情
export const viewOgPaper = async (paperId: string) =>
  await request<
    API.API_TYPE<
      Pick<PaperPayloadType, 'detail' | 'name'> & {
        questions: QuestionsType;
        paperId: string;
      }
    >
  >(`/api/paper/view`, {
    method: 'GET',
    params: { paperId },
  });

export const updatePaper = async (paperId: string, payload: PaperPayloadType) =>
  await request<API.API_TYPE<null>>(`/api/paper/update/${paperId}`, {
    method: 'PUT',
    data: payload,
  });
export const deletePaper = async (paperId: string) =>
  await request<API.API_TYPE<null>>(`/api/paper/del/${paperId}`, {
    method: 'DELETE',
  });
export const issuedPaper = async (paperId: string, organizeId: string) =>
  await request<API.API_TYPE<null>>(`/api/paper/issued/${paperId}`, {
    method: 'PUT',
    data: { organizeId },
  });
