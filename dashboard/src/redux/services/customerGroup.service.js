
import { get, del, put , post , delWithBody} from "src/utils/request";
/* eslint-disable */
const CustomerGroupsService = {
  getAllCustomerGroup: async () => {
    try {
      const res = await get('customer-group');
      return res;
    } catch (err) {
      throw err;
    }
  },
  getOneCustomerGroup: async (id) => {
    try {
      return await get(`customer-group/${id}`);
    } catch (err) {
      throw err;
    }
  },
  deleteOneCustomerGroup: async (id) => {
    try {
      const res = await del(`customer-group/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  createCustomerGroup: async (data) => {
    try {
      const res = await post('customer-group', data); 
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateCustomerGroup: async (id, data) => {
    try {
      const res = await put(`customer-group/${id}`, data); 
      return res.data; 
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  addCustomerToGroup: async (id, data) => {
    try {
      const res = await post(`customer-group/addCustomer/${id}`, data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  removeCustomerFromGroup: async (id, idUser) => {
    try {
      console.log('Sending idCG:', id);
      console.log('Sending idUser:', idUser);
      const res = await delWithBody(`customer-group/delOnceCustomer/${id}`, { idUser });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export default CustomerGroupsService;
