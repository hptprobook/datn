import request from '~/config/axiosConfig';

export const login = async (data) => {
  return await request.post('/auth/login', data).then((res) => res.data);
};

export const register = async (data) => {
  return await request.post('/auth/register', data).then((res) => res.data);
};

export const logout = async () => {
  return await request.post('/auth/logout').then((res) => res.data);
};
