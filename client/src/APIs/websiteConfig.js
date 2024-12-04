import request from '~/config/axiosConfig';

export const getWebsiteConfig = async () => {
  try {
    const response = await request.get('/web');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
