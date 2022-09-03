// @ts-ignore
/* eslint-disable */






declare namespace API {
  type API_TYPE<T> = {
    message: string | { [k: string]: string };
    code: number;
    data: T | null;
  };

  type Login = API_TYPE<{
    token: string;
  }>;
  type CurrentUser = API_TYPE<{
    _id: string;
    nickname: string;
    email: string;
    gender: number;
    avtar_url: string;
    is_ban: boolean;
    profile: string;
    create_time: Date;
    update_time: Date;
    auth: 'super' | 'admin' | 'user';
    favours: string[],

  }>;

  type Upload = API_TYPE<{ fileURL: string }>;

  type UpdateUser = API_TYPE<null>;

  type TagAll = {
    name: string;
    tags: string[];
  }[];

  type QuestionList<T> = API_TYPE<{
    list: T[],
    total: number
  }>;
}

declare namespace Payload {
  type Login = {
    eamil: string;
    password: string;
  };
  type SendMail = {
    email: string;
  };

  type Register = {
    nickname: string;
    gender;
    password;
    email;
    gender;
    captcha;
  };
  type UploadAvatar = {
    avatar: File;
  };
  type UpdateUser = { nickname: string; gender: number; profile: string };

  type QuestionSearchParams = {
    title?: string;
    type?: number;
    difficulty?: string;
    tags?: string[]; // 须包含全部标签才查出
    orderKey?: 'create_time' | 'favourNum';
    order?: string;
    pageSize?: number;
    pageNum?: number;
    reviewStatus?: number
  };
}
