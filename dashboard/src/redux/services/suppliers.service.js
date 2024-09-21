import { get, del, put, post } from 'src/utils/request';
/* eslint-disable */

const SupplierServices = {
  getAll: async () => await get('suppliers'),
  create: async (data) => await post('suppliers', data),
  delete: async (id) => await del(`suppliers/${id}`),
  getDetail: async (id) => await get(`suppliers/${id}`),
  update: async (id, data) => await put(`suppliers/${id}`, data),
};

export default SupplierServices;
