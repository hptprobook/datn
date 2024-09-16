import { get, put, post, del, patch, upload } from 'src/utils/request';
/* eslint-disable */

const SettingServices = {
  getNav: async () => await get('navDashboard'),
  removeNav: async (id) => await del(`navDashboard/${id}`),
  addNav: async (data) => await post('navDashboard', data),
  updateNav: async (id, data) => await put(`navDashboard/${id}`, data),
  getNavById: async (id) => await get(`navDashboard/${id}`),
  updateMutipleNav: async (data) => await patch('navDashboard', data),
  getSeoConfig: async () => await get('seo'),
  updateSeoConfig: async (data) => await put('seo', data),
  uploadSeoConfig: async (file) => await upload({
    type: 'put',
    file,
    path: 'seo',
  }),
  getConfigWebsite: async () => await get('web'),
  updateConfigWebsite: async (data) => await put('web', data),
  uploadConfigWebsite: async (file) => await upload({
    type: 'put',
    file,
    path: 'web',
  }),
};

export default SettingServices;
