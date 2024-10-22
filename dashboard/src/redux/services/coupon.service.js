import { get, del, put , post  } from 'src/utils/request';
/* eslint-disable */

const CouponServices = {
  getAll: async () => await get('coupons'),
  getOne: async (id) => await get(`coupons/${id}`),
  create: async (data) => await post('coupons', data),
  update: async (id, data) => await put(`coupons/${id}`, data),
  delete: async (id) => await del(`coupons/${id}`),
  deleteMany: async (ids) => await post('coupons/many', { ids }),
};

export default CouponServices;
