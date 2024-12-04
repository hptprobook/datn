/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const createOrderAPI = async (data) => {
  try {
    const response = await request.post('/orders', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchOrderAPI = async (data) => {
  try {
    const response = await request.get('/orders/me/search', { params: data });
    return response.data;
  } catch (error) {
      throw error.response.data;
  }
};

export const updateOrderAPI = async (data) => {
  try {
    const response = await request.put(`/orders/me/${data.id}`, data.data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteOrderAPI = async (id) => {
  try {
    const response = await request.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
