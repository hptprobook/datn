import { get, put, del, post } from 'src/utils/request';
/* eslint-disable */

const WebBannerServices = {
  getAll: async () => await get('web-banner'),
  create: async (data) => {
    try {
      return await post('/web-banner', data);
    }
    catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  },
  delete: async (id) => {
    try {
      return await del(`web-banner/${id}`);
    }
    catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  },
  getById: async (id) => {
    try {
      return await get(`web-banner/${id}`);
    }
    catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  },
  update: async ({ data, id }) => {
    try {
      return await put(`web-banner/${id}`, data);
    }
    catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  },
};

export default WebBannerServices;
