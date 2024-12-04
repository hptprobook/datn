import request from '~/config/axiosConfig';

export const getAllWebBanner = async () => {
  try {
    const response = await request.get('/web-banner');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
