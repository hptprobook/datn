/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getStaticPageContent = async ({ slug }) => {
  try {
    const response = await request.get(`/static-pages/${slug}?by=slug`);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy trang tĩnh website:', error);
    throw error.response.data;
  }
};
