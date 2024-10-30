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
            return await get(`/products/search?search=${keyword}&page=${page}&limit=${limit}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    getMe: async () => {
        try {
            return await get("/staffs/auth/me");
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    }
};

export default PosService;
