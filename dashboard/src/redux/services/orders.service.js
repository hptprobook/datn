import { get, put, post } from 'src/utils/request';
/* eslint-disable */

const OrderServices = {
  getAll: async () => await get('orders'),
  getById: async (id) => await get(`orders/${id}`),
  updateOrder: async (id, data) => await put(`orders/${id}`, data),
  createOrder: async (data) => await post('orders/not', data),
};

export default OrderServices;
