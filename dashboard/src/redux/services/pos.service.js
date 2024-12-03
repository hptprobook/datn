import { get } from "src/utils/request";

const PosService = {
    trackingOrder: async (c) => {
        try {
            return await get(`/orders/not/${c}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    searchProduct: async ({
        keyword,
        page,
        limit,
    }) => {
        try {
            return await get(`/products/search/dashboard?keyword=${keyword}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    searchProducts: async (keyword) => {
        try {
            return await get(`/products/search/dashboard?keyword=${keyword}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    searchUser: async (search) => {
        try {
            return await get(`/users?search=${search}&page=1&limit=10`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    }
};

export default PosService;
