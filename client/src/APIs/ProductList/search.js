/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const searchProducts = async ({ keyword, limit = 5 } = {}) => {
  try {
    const response = await request.get(
      `/products/search?search=${keyword}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
