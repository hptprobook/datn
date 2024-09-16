import { get } from 'src/utils/request';
/* eslint-disable */

const OrderServices = {
  getAll: async () => await get('orders')
};

export default OrderServices;
