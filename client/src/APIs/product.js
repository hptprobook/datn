/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getAllProducts = async ({ limit = 20 } = {}) => {
  try {
    const response = await request.get(`/products?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await request.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};
