import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productSlice";
import categoriesReducer from "./slices/categoriesSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
    reducer: {
        users: userReducer,
        auth: authReducer,
        products: productsReducer,
        categories: categoriesReducer,
    },
});
