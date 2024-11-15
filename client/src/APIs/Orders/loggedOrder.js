/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const createOrderAPI = async (data) => {
  try {
    const response = await request.post('/orders', data);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi đặt hàng', error);
    throw error;
  }
};

export const updateOrderAPI = async (data) => {
  try {
    const response = await request.put(`/orders/me/${data.id}`, data.data);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi huỷ đơn hàng', error);
    throw error.response.data;
  }
};

export const deleteOrderAPI = async (id) => {
  try {
    const response = await request.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi xóa đơn hàng', error);
    throw error.response.data;
  }
};
