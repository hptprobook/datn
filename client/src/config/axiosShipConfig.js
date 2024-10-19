import axios from 'axios';

const baseURL = import.meta.env.VITE_GHN_URL;
const Token = import.meta.env.VITE_GHN_TOKEN;
const ShopId = import.meta.env.VITE_GHN_SHOP_ID;

const shipRequest = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Token,
    ShopId,
  },
});

export const get = async (path, options = {}) => {
  const response = await shipRequest.get(path, options);
  return response.data;
};
export const post = async (path, options = {}) => {
  const response = await shipRequest.post(path, options);
  return response.data;
};

export default shipRequest;
