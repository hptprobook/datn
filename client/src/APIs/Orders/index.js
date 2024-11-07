/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const checkStockProducts = async (data) => {
  try {
    const response = await request.post('/orders/check_stock', data);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi kiểm tra số lượng tồn kho của sản phẩm', error);
    throw error;
  }
};

export const getCurrentOrders = async ({ limit = 10 }) => {
  try {
    const response = await request.get('/orders/me/current?limit=' + limit);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy danh sách đơn hàng người dùng', error);
    throw error;
  }
};

export const getCurrentOrderWithStatus = async ({ limit = 10, status }) => {
  try {
    const response = await request.get(
      `/orders/me/status/?status=${status}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy danh sách đơn hàng người dùng', error);
    throw error;
  }
};

export const getOrderByCodeAPI = async (code) => {
  try {
    const response = await request.get(`/orders/me/code/${code}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi tìm kiếm đơn hàng bằng code', error);
    throw error.response.data;
  }
};
