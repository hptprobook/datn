/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getWebsiteConfig = async () => {
  try {
    const response = await request.get('/web');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy cấu hình website:', error);
    throw error.response.data;
  }
};
