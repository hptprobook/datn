/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getAllWebBanner = async () => {
  try {
    const response = await request.get('/web-banner');
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi lấy tất cả banner web:', error);
    throw error;
  }
};
