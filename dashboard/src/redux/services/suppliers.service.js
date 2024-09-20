import { get, del, post } from 'src/utils/request';
/* eslint-disable */

const SupplierServices = {
  getAll: async () => await get('suppliers'),
  create: async (data) => await post('suppliers', data),
  delete: async (id) => await del(`suppliers/${id}`),
};

export default SupplierServices;
