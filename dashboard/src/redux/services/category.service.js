import { get, put, del, upload } from 'src/utils/request';
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
  getCategoriesParent: async () => {
    try {
      const res = await get('categories?parent=true');
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
  createCategory: async ({ file, additionalData = {} }) => {
    try {
      const res = await upload({
        path: 'categories',
        file,
        type: 'post',
        additionalData,
      });
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
