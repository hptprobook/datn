import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_API_GHN_URL;
const token = import.meta.env.VITE_REACT_TOKEN_GHN;

// Function to get the access token from local storage
const requestGHN = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        "Token": token,
    },
});

// Intercept requests and update the Authorization header
requestGHN.interceptors.request.use((config) => {
    config.headers.Token = token;
    return config;
});
export const getProvince = async (path, options = {}) => {
    const response = await requestGHN.get(path, options);
    return response.data;
};
export const getDistrict = async (path, options = {}) => {
    const response = await requestGHN.post(path, options);
    return response.data;
};
export const getWard = async (path, options = {}) => {
    const response = await requestGHN.post(path, options);
    return response.data;
};
export const getFee = async (path, options = {}) => {
    const response = await requestGHN.post(path, options);
    return response.data;
};
export default requestGHN;
