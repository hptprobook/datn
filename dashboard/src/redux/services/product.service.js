import { get, put , post } from "src/utils/request";
/* eslint-disable */
const ProductsService = {
  getAllProducts: async () => {
    try {
      const res = await get('products');
      return res;
    } catch (err) {
      throw err;
    }
  },
  getProductById: async (id) => {
    try {
      const res = await get(`products/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  deleteProductById: async (id) => {
    try {
      const res = await request.delete(`products/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  createProduct: async (data) => {
    try {
      const res = await post(`products`, data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateProduct: async (id, data) => {
    try {
      const res = await put(`products/${id}`, data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

export default ProductsService;
