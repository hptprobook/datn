import { get, put, post, del } from 'src/utils/request';
/* eslint-disable */

const OrderServices = {
  getAll: async () => await get('orders')
};

export default OrderServices;
