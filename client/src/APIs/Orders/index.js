import request from '~/config/axiosConfig';

export const checkStockProducts = async (data) => {
  try {
    const response = await request.post('/orders/check_stock', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCurrentOrders = async ({ limit = 10, sort = 'newest' }) => {
  try {
    const response = await request.get(
      `/orders/me/current?limit=${limit}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCurrentOrderWithStatus = async ({
  limit = 10,
  status,
  sort = 'newest',
}) => {
  try {
    const response = await request.get(
      `/orders/me/status/?status=${status}&limit=${limit}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getOrderByCodeAPI = async (code) => {
  try {
    const response = await request.get(`/orders/me/code/${code}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getVnpayUrlAPI = async (data) => {
  try {
    const response = await request.post('/pays/vnpay', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
