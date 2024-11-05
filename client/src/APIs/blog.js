/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getAllBlogAPI = async ({ limit = 12 }) => {
  try {
    const response = await request.get('/blogs?limit=' + limit);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy tất cả bài viết:', error);
    throw error.response.data;
  }
};

export const getTopViewBlogAPI = async () => {
  try {
    const response = await request.get('/blogs/topViews');
    return response.data;
  } catch (error) {
    console.error(
      'Xảy ra lỗi khi lấy tất cả bài viết có lượt xem cao nhất:',
      error
    );
    throw error.response.data;
  }
};

export const getBlogBySlugAPI = async ({ slug }) => {
  try {
    const response = await request.get('/blogs/slug/' + slug);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy chi tiết bài viết: ', error);
    throw error.response.data;
  }
};
