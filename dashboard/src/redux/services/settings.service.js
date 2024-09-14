import { get, put, post, del, patch } from 'src/utils/request';
/* eslint-disable */

const SettingServices = {
  getNav: async () => await get('navDashboard'),
  removeNav: async (id) => await del(`navDashboard/${id}`),
  addNav: async (data) => await post('navDashboard', data),
  updateNav: async (id, data) => await put(`navDashboard/${id}`, data),
  getNavById: async (id) => await get(`navDashboard/${id}`),
  updateMutipleNav: async (data) => await patch('navDashboard', data),
};

export default SettingServices;
