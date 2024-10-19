import { get, put, del, post } from 'src/utils/request';
/* eslint-disable */

const WarehouseServices = {
  getAll: async () => await get('warehouses'),
  create: async (data) => {
    try {
      return await post('/warehouses', data);
    }
    catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  },
  delete: async (id) => {
    try {
      return await del(`warehouses/${id}`);
    }
    catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  },
  getById: async (id) => {
    try {
      return await get(`warehouses/${id}`);
    }
    catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  },
  update: async ({ data, id }) => {
    try {
      return await put(`warehouses/${id}`, data);
    }
    catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  },
};

export default WarehouseServices;
