/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getAllBlogAPI = async ({
  limit = 12,
  page = 1,
  sort = 'newest',
  tags = '', // Tags là chuỗi
  search = '',
}) => {
  try {
    const queryParams = new URLSearchParams();

    // Thêm các tham số query
    queryParams.append('limit', limit);
    queryParams.append('page', page);
    if (sort) queryParams.append('sort', sort);
    if (search.trim()) queryParams.append('search', search);
    if (tags.trim()) queryParams.append('tags', tags); // Kiểm tra và thêm tags nếu có

    const response = await request.get(
      `/blogs/getAll?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTopViewBlogAPI = async () => {
  try {
    const response = await request.get('/blogs/topViews');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTags = async () => {
  try {
    const response = await request.get('/blogs/getTags');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBlogBySlugAPI = async ({ slug }) => {
  try {
    const response = await request.get('/blogs/slug/' + slug);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateViewBlog = async ({ id }) => {
  try {
    const response = await request.patch('/blogs/views/' + id);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
