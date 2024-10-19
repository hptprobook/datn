import { get, del,  uploadWebBanner ,updateWebBanner } from 'src/utils/request';
/* eslint-disable */

const WebBannerServices = {
  getAll: async () => await get('web-banner'),
  create: async (data) => {
    try {
      const res = await uploadWebBanner({
        data,
        type: 'post',
        path: 'web-banner',
      });
      return res.data;
    } catch (err) {
      console.log(err);
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
      const res = await updateWebBanner({
        data,
        path: `web-banner/${id}`,
      });
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

export default WebBannerServices;
