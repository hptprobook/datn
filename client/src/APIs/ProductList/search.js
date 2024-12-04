/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const searchProducts = async ({ keyword, limit = 5 } = {}) => {
  try {
    const response = await request.get(
      `/products/search?search=${keyword}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getHotSearch = async () => {
  try {
    const response = await request.get('/hotSearch');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
