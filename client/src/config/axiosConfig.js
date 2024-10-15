import axios from 'axios';
import { handleToast } from '~/customHooks/useToast';

// const baseDomain = import.meta.env.VITE_DOMAIN;
const baseURL = import.meta.env.VITE_API_ROOT;

const getAccessToken = () => localStorage.getItem('token');

const request = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

request.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  return config;
});

export const handleUnauthorizedError = (navigate, openNotify) => {
  localStorage.removeItem('token');
  openNotify(() => {
    navigate('/tai-khoan/dang-nhap');
  });
};

request.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kiểm tra nếu lỗi là 401
    if (error.response && error.response.status === 401) {
      axios
        .post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            localStorage.removeItem('token');
            handleToast(
              'error',
              'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
            );
            window.location.href = '/';
          }
          if (err.response.status === 401) {
            localStorage.removeItem('token');
            handleToast(
              'error',
              'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
            );
            window.location.href = '/';
          }
        });
    }
    return Promise.reject(error);
  }
);

export const get = async (path, options = {}) => {
  const response = await request.get(path, options);
  return response.data;
};
export const post = async (path, options = {}) => {
  const response = await request.post(path, options);
  return response.data;
};
export const put = async (path, options = {}) => {
  const response = await request.put(path, options);
  return response.data;
};
export const del = async (path, options = {}) => {
  const response = await request.delete(path, options);
  return response.data;
};

export default request;
