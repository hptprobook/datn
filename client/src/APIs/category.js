/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getAllCategory = async () => {
  try {
    const response = await request.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy tất cả danh mục:', error);
    throw error;
  }
};

export const increaseCategoryView = async (data) => {
  try {
    const response = await request.get(`/categories/${data.slug}/views`);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi tăng view cho sản phẩm:');
    throw error.response.data;
  }
};

export const getBestViewCategory = async () => {
  try {
    const response = await request.get('/categories/getByView');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy sản phẩm top view:');
    throw error.response.data;
  }
};

export const getMenu = async () => {
  try {
    const response = await request.get('/categories/menu');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy menu:', error);
    throw error;
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const response = await request.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy danh mục bằng id:', error);
    throw error;
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const response = await request.get(`/categories/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy danh mục bằng slug:', error);
    throw error;
  }
};
