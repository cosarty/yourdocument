import { request } from 'umi';

export const uploadAvatar = async (payload: Payload.UploadAvatar) => {
  const formdata = new FormData();
  formdata.append('avatar', payload.avatar);

  return await request<API.Upload>('/api/upload/avatar', {
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data: formdata,
  });
};

export default {
  uploadAvatar,
};
