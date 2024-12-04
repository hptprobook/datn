import request from '~/config/axiosConfig';

export const loginAuth = async (data) => {
  try {
    const response = await request.post('/auth/login', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginGoogleAPI = async (data) => {
  try {
    const response = await request.post('/auth/loginSocial', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (data) => {
  try {
    const response = await request.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getOTP = async (data) => {
  try {
    const response = await request.post('/auth/otps', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const checkOTP = async (data) => {
  try {
    const response = await request.post('/auth/otps/verify', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await request.put('/auth/otps/reset-password', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutAPI = async () => {
  try {
    const response = await request.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const sendOTP = async (data) => {
  try {
    const response = await request.post('/send-otp', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
