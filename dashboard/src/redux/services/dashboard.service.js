import { get, del, put, post } from "src/utils/request";

const DashboardService = {
    create: async (path, c) => {
        try {
            return await post(path, c);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    gets: async (path) => {
        try {
            return await get(path);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    delete: async (path) => {
        try {
            return await del(path);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    update: async (path, c) => {
        try {
            return await put(path, c);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
};

export default DashboardService;
