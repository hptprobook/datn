import { get, post } from 'src/utils/request';
/* eslint-disable */

const CouponServices = {
  getAll: async () => await get('coupons'),
  create: async (data) => await post('coupons', data),
};

export default CouponServices;
