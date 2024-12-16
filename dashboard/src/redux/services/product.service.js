import { get, del, post, uploadProduct, updateProduct } from "src/utils/request";
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
  creates: async (data) => {
    try {
      const res = await post('products/creates', data);
      return res;
    } catch (err) {
      throw err;
    }
  },
  getProductById: async (id) => {
    try {
      return await get(`products/${id}`);
    } catch (err) {
      throw err;
    }
  },
  deleteProductById: async (id) => {
    try {
      const res = await del(`products/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  createProduct: async (data) => {
    try {
      const res = await uploadProduct({
        data,
        type: 'post',
        path: 'products',
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateProductById: async (id, data) => {
    try {
      const res = await updateProduct({
        id,
        data,
      });
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

export default ProductsService;
