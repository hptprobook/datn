import { get } from "src/utils/request";

const AddressService = {
    getProvince: async () => {
        try {
            return await get("/address/tinh");
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    getDistrict: async (provinceId) => {
        try {
            return await get(`/address/huyen/${provinceId}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    getWard: async (districtId) => {
        try {
            return await get(`/address/xa/${districtId}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
};

export default AddressService;
