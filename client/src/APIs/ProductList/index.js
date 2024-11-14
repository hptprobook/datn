/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const increaseProductView = async (data) => {
  try {
    const response = await request.get(`/products/${data.slug}/views`);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi tăng view cho sản phẩm:');
    throw error.response.data;
  }
};

export const getBestViewProduct = async () => {
  try {
    const response = await request.get('/products/getByViews');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy sản phẩm top view:');
    throw error.response.data;
  }
};

export const getAllWarehouses = async () => {
  try {
    const response = await request.get('/warehouses');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy tất cả kho:');
    throw error.response.data;
  }
};
