import axios from 'axios';
import { API_ROOT, FIREBASE_API_KEY } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const getAccessToken = () => localStorage.getItem('accessToken');

const request = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const isTokenExpired = (token) => {
  const user = jwtDecode(token);
  return dayjs.unix(user.exp).diff(dayjs()) < 1;
};

const refreshAccessToken = async () => {
  const refreshToken = cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
      `grant_type=refresh_token&refresh_token=${refreshToken}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    localStorage.setItem('accessToken', response.data.access_token); // Use access_token instead of accessToken
    return response.data.access_token;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error refreshing access token', error);
    throw error;
  }
};

request.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();

    if (token && isTokenExpired(token)) {
      try {
        token = await refreshAccessToken();
      } catch (error) {
        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default request;
