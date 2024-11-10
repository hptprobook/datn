/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const orderNotLoginApi = async (data) => {
  try {
    const response = await request.post('/orders/not', data);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi đặt hàng không đăng nhập', error);
    throw error.response.data;
  }
};

export const findOrderByCodeAPI = async (code) => {
  try {
    const response = await request.get(`/orders/not/${code}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi tìm kiếm đơn hàng bằng code', error);
    throw error.response.data;
  }
};

export const updateOrderNotLoginAPI = async (data) => {
  console.log(data);
  try {
    const response = await request.put(`/orders/not/${data.id}`, data.data);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi đặt đơn hàng', error);
    throw error.response.data;
  }
};

export const removeOrderNotLoginAPI = async (id) => {
  try {
    const response = await request.put(`/orders/not/${id}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi xoá đơn hàng', error);
    throw error.response.data;
  }
};
