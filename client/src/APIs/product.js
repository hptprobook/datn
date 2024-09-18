import request from '~/config/axiosConfig';

export const getAllProducts = async () => {
  return await request.get('/products').then((res) => res.data);
};

export const getProductById = async (id) => {
  return await request.get(`/products/${id}`).then((res) => res.data);
};
