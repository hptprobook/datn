import { del, get, put, post } from "src/utils/request";

const VariantService = {
    all: async () => {
        try {
            return await get("/variants");
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    create: async (data) => {
        try {
            return await post("/variants", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    delete: async (id) => {
        try {
            return await del(`variants/${id}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },

    getStaffBy: async ({ type, value }) => {
        try {
            return await get(`variants/${value}?by=${type}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    update: async (id, data) => {
        try {
            return await put(`variants/${id}`, data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
};

export default VariantService;
