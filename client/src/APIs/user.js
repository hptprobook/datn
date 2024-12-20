import request from '~/config/axiosConfig';

export const getCurrentUser = async () => {
  try {
    const response = await request.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateCurrentUser = async (data) => {
  try {
    const response = await request.put('/users/me', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const readAllNotifiesAPI = async () => {
  try {
    const response = await request.get('/users/notifies/readAll');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addCartToCurrent = async (data) => {
  try {
    const response = await request.put('/users/me/addCart', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeCartToCurrent = async (_id) => {
  try {
    const response = await request.put('/users/me/removeCart', _id);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const changePassWord = async (data) => {
  try {
    const response = await request.post('/auth/changePassword', data);
    return response.data;
  } catch (error) {
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
    throw error.response.data;
  }
};
