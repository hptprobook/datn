/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const sortProductsByCatSlug = async ({
  slug,
  limit = 20,
  key,
  value,
} = {}) => {
  try {
    const response = await request.get(
      `/products/${slug}/filter?limit=${limit}&${key}=${value}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
