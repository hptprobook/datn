import { get, put, post, del } from 'src/utils/request';
/* eslint-disable */

const SettingServices = {
  getNav: async () => await get('navDashboard'),
  removeNav: async (id) => await del(`navDashboard/${id}`),
  addNav: async (data) => await post('navDashboard', data),
  updateNav: async (id, data) => await put(`navDashboard/${id}`, data),
};

export default SettingServices;
