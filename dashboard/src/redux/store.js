import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productSlice";

export const store = configureStore({
    reducer: {
        users: userReducer,
        products: productsReducer,
    },
});
