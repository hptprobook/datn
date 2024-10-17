/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getCurrentUser = async () => {
  try {
    const response = await request.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy thông tin người dùng hiện tại:', error);
    throw error;
  }
};

export const updateCurrentUser = async (data) => {
  try {
    const response = await request.put('/users/me', data);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi cập nhật thông tin người dùng:', error);
    throw error;
  }
};
