import request from '~/config/axiosConfig';

export const getAllCategory = async () => {
  return await request.get('/categories').then((res) => res.data);
};

export const getMenu = async () => {
  return await request.get('/categories/menu').then((res) => res.data);
};

export const getCategoryById = async (categoryId) => {
  return await request.get(`/categories/${categoryId}`).then((res) => res.data);
};

export const getCategoryBySlug = async (slug) => {
  return await request.get(`/categories/slug/${slug}`).then((res) => res.data);
};
