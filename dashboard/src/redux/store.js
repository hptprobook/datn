import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productSlice";
import categoriesReducer from "./slices/categoriesSlice";

export const store = configureStore({
    reducer: {
        users: userReducer,
        products: productsReducer,
        categories: categoriesReducer,
    },
});
