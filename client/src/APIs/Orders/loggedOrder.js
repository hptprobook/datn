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
