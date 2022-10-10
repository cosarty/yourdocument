import { request } from '@umijs/max';

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

// /api/paper/create

export const cratePaper = async (payload: {
  name: string;
  detail: string;
  questions: { grade: number; question: string }[];
}) =>
  await request<API.API_TYPE<null>>(`/api/paper/create`, {
    method: 'POST',
    data: payload,
  });

export const getMyPaper = async () =>
  await request<API.API_TYPE<SourcePaperType[]>>(`/api/paper/get/myPaper`, {
    method: 'GET',
  });
