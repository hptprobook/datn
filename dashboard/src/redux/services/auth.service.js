import { post } from "src/utils/request";

const AuthService = {
    login: async (data) => {
        try {
            return await post("/auth/login", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    register: async (data) => {
        try {
            return await post("/auth/register", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    logout: async () => {
        try {
            return await post("/auth/logout");
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    forgotPassword: async (data) => {
        try {
            return await post("/auth/forgot-password", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    resetPassword: async (data) => {
        try {
            return await post("/auth/reset-password", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
};

export default AuthService;
