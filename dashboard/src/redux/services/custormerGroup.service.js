
import { get, del, put , post} from "src/utils/request";
/* eslint-disable */
const CustormerGroupsService = {
  getAllCG: async () => {
    try {
      const res = await get('customer-group');
      return res;
    } catch (err) {
      throw err;
    }
  },
  getOneCG: async (id) => {
    try {
      return await get(`customer-group/${id}`);
    } catch (err) {
      throw err;
    }
  },
  deleteOneCG: async (id) => {
    try {
      const res = await del(`customer-group/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  createCustormerGroup: async (data) => {
    try {
      const res = await post(`customer-group/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateCustormerGroup: async (id, data) => {
    try {
      const res = await put(`customer-group/${id}`,data);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

export default CustormerGroupsService;
