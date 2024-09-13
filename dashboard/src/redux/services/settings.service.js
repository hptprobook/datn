import { get, put, post, del } from 'src/utils/request';
/* eslint-disable */

const SettingServices = {
  getNav: async () => await get('navDashboard')
};

export default SettingServices;
