import { get } from 'src/utils/request';
/* eslint-disable */

const OrderServices = {
  getAll: async () => await get('orders'),
  getById: async (id) => await get(`orders/${id}`),
};

export default OrderServices;
