/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const orderNotLoginApi = async (data) => {
  try {
    const response = await request.post('/orders/not', data);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi đặt hàng không đăng nhập', error);
    throw error;
  }
};
