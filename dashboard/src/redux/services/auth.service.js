import { get, post, put } from "src/utils/request";

const AuthService = {
    login: async (data) => {
        try {
            return await post("/users/login", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    register: async (data) => {
        try {
            return await post("/users/register", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    logout: async () => {
        try {
            return await get("/users/logout");
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    forgotPassword: async (data) => {
        try {
            return await post("/users/forgot-password", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    resetPassword: async (data) => {
        try {
            return await post("/users/reset-password", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
};

export default AuthService;
