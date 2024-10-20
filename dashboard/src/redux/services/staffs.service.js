import { del, get, put, post } from "src/utils/request";

const StaffsService = {
    all: async () => {
        try {
            return await get("/staffs");
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    create: async (data) => {
        try {
            return await post("/users", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    delete: async (id) => {
        try {
            return await del(`users/${id}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },

    getUser: async (id) => {
        try {
            return await get(`users/${id}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    editUser: async (id, data) => {
        try {
            return await put(`users/${id}`, data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
};

export default StaffsService;
