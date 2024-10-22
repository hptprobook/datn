/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const checkStockProducts = async (data) => {
  try {
    const response = await request.post('/orders/check_stock', data);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi kiểm tra số lượng tồn kho của sản phẩm', error);
    throw error;
  }
};
