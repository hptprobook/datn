import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotify } from '~/context/ReLoginContext';

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

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');

      const { openNotify } = useNotify();
      const navigate = useNavigate();

      openNotify(() => {
        navigate('/tai-khoan/dang-nhap');
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
