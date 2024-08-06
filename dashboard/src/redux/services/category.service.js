import { get, put, post, del } from 'src/utils/request';
/* eslint-disable */

const CategoryService = {
  getAllCategories: async () => {
    try {
      const res = await get('categories');
      return res;
    } catch (err) {
      throw err;
    }
  },
  getCategoryById: async (categoryId) => {
    try {
      const res = await get(`categories/${categoryId}`);
      return res;
    } catch (err) {
      throw err;
    }
  },
  createCategory: async (data) => {
    try {
      const res = await post(`categories/add`, data);
      return res;
    } catch (err) {
      throw err;
    }
  },
  deleteCategory: async (id) => {
    try {
      return await del(`categories/${id}`);
    } catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  },
  updateCategory: async (categoryId, data) => {
    try {
      const res = await put(`categories/${categoryId}`, data);
      return res.data;
    } catch (err) {
      console.log('Error: ', err);
      throw err;
    }
  },
};

export default CategoryService;
