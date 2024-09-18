import { get, put } from 'src/utils/request';
/* eslint-disable */

const OrderServices = {
  getAll: async () => await get('orders'),
  getById: async (id) => await get(`orders/${id}`),
  updateOrder: async (id, data) => await put(`orders/${id}`, data),
};

export default OrderServices;
