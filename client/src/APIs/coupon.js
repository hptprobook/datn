/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getCouponsForOrder = async () => {
  try {
    const response = await request.get('/coupons/getForOrder');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy mã giảm giá:', error);
    throw error.response.data.message;
  }
};
