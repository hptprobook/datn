/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const orderNotLoginApi = async (data) => {
  try {
    const response = await request.post('/orders/not', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const findOrderByCodeAPI = async (code) => {
  try {
    const response = await request.get(`/orders/not/${code}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateOrderNotLoginAPI = async ({ id, data, secretKey }) => {
  try {
    const response = await request.put(`/orders/not/${id}`, {
      ...data,
      secretKey,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeOrderNotLoginAPI = async (id) => {
  try {
    const response = await request.put(`/orders/not/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
