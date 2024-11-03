import { get, post } from "src/utils/request";

const DashboardService = {
    create: async (path, c) => {
        try {
            return await post(path, c);
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
    searchUser: async (search) => {
        try {
            return await get(`/users?search=${search}&page=1&limit=10`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    }
};

export default DashboardService;
