import request from '~/config/axiosConfig';

export const handleRequest = async (method, url, data) => {
  try {
    return request[method](url, data).then((res) => res.data);
  } catch (error) {
    throw new Error(error);
  }
};
