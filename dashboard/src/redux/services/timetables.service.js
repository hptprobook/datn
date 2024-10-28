import { del, get, put, post } from "src/utils/request";

const TimetablesService = {
    all: async () => {
        try {
            return await get("/timetables?grBy=date");
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    create: async (data) => {
        try {
            return await post("/timetables", data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    delete: async (id) => {
        try {
            return await del(`timetables/${id}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },

    getStaffBy: async ({ type, value }) => {
        try {
            return await get(`timetables/${value}?by=${type}`);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
    update: async (id, data) => {
        try {
            return await put(`timetables/${id}`, data);
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    },
};

export default TimetablesService;
