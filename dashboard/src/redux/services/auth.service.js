import { get, post } from "src/utils/request";

const AuthService = {
    login: async (data) => {
        try {
            return await post("/staffs/auth/login", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    logout: async () => {
        try {
            return await post("/staffs/auth/logout");
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

export default AuthService;
