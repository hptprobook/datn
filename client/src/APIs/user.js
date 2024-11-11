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

export const readAllNotifiesAPI = async () => {
  try {
    const response = await request.get('/users/notifies/readAll');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi cập nhật thông tin người dùng:', error);
    throw error;
  }
};

export const addCartToCurrent = async (data) => {
  try {
    const response = await request.put('/users/me/addCart', data);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    throw error;
  }
};

export const removeCartToCurrent = async (_id) => {
  try {
    const response = await request.put('/users/me/removeCart', _id);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi xoá sản phẩm khỏi giỏ hàng:', error);
    throw error;
  }
};

export const changePassWord = async (data) => {
  console.log(data);
  try {
    const response = await request.post('/auth/changePassword', data);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi thay đổi mật khẩu:', error);
    throw error.response.data;
  }
};

export const updateInfor = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }

  try {
    const response = await request.put('/users/me/infor', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi cập nhật thông tin người dùng:', error);
    throw error;
  }
};
