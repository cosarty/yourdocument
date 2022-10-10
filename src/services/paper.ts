import { request } from '@umijs/max';

export type PaperType = {
  papersId: { detail: string; _id: string; name: string };

  publish: boolean;
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
