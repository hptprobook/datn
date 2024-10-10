import { get } from 'src/utils/request';
/* eslint-disable */

const WarehouseServices = {
  getAll: async () => await get('warehouses')
};

export default WarehouseServices;
