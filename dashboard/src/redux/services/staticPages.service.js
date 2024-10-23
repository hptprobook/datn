import { del, get, put, post } from "src/utils/request";

const StaticPageService = {
    all: async () => {
        try {
            return await get("/static-pages");
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    create: async (data) => {
        try {
            return await post("/static-pages", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    delete: async (id) => {
        try {
            return await del(`static-pages/${id}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },

    findOne: async ({ type, value }) => {
        try {
            return await get(`static-pages/${value}?by=${type}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    update: async (id, data) => {
        try {
            return await put(`static-pages/${id}`, data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
};

export default StaticPageService;
