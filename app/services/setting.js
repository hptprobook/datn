import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Base URL for the API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
// Create an instance of axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    return token !== null ? token : null;
  } catch (error) {
    console.error('Failed to fetch the token from AsyncStorage', error);
    return null;
  }
};

// define const API

export const CREATE_CHAT = '/chat/message'
export const GET_CHAT_HISTORY = '/chat'
export const CREATE_BOT_ANSWER = '/chat/answer'


export default apiClient