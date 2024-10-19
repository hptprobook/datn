import { get, del, post  } from 'src/utils/request';
/* eslint-disable */

const CouponServices = {
  getAll: async () => await get('coupons'),
  create: async (data) => await post('coupons', data),
  delete: async (id) => await del(`coupons/${id}`),
  deleteMany: async (ids) => await post('coupons/many', { ids }),
};

export default CouponServices;
