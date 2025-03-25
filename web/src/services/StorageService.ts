import { get, post, del } from '../utils/request';

// 上传文件
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return post('/api/v1/storage/upload', {
    body: formData,
  });
};

// 获取文件
export const getFile = (tid: string) => {
  return get(`/api/v1/storage/${tid}`);
};

// 删除文件
export const deleteFile = (tid: string) => {
  return del(`/api/v1/storage/${tid}`);
};
