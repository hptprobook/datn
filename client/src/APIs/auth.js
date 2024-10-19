/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const loginAuth = async (data) => {
  try {
    const response = await request.post('/auth/login', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi đăng nhập:', error);
    throw error;
  }
};

export const register = async (data) => {
  try {
    const response = await request.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi đăng ký:', error);
    throw error;
  }
};

export const logoutAPI = async () => {
  try {
    const response = await request.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi đăng xuất:', error);
    throw error;
  }
};

export const sendOTP = async (data) => {
  try {
    const response = await request.post('/send-otp', data);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi gửi OTP:', error);
    throw error;
  }
};
