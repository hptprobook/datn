import { get } from 'src/utils/request';
/* eslint-disable */

const CouponServices = {
  getAll: async () => await get('coupons')
};

export default CouponServices;
