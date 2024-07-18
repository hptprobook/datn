import { get, put } from "src/utils/request";

const UserService = {
    getAllUsers: async () => {
        try {
            return await get("users");
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

export default UserService;
