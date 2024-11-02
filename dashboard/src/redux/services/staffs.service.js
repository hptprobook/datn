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
            return await post("/staffs", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    delete: async (id) => {
        try {
            return await del(`staffs/${id}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },

    getStaffBy: async ({ type, value }) => {
        try {
            return await get(`staffs/${value}?by=${type}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    update: async (id, data) => {
        try {
            return await put(`staffs/${id}`, data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    updateMe: async (data) => {
        try {
            return await post("staffs/auth/me", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
};

export default StaffsService;
