/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getAllBlogAPI = async () => {
  try {
    const response = await request.get('/blogs');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy tất cả bài viết:', error);
    throw error.response.data;
  }
};
