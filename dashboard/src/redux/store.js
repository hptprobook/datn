import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productSlice";
import categoriesReducer from "./slices/categorySlices";
import authReducer from "./slices/authSlice";
import ordersReducer from "./slices/orderSlices";
import settingsReducer from "./slices/settingSlices";
import couponsReducer from "./slices/couponSlice";
import suppliersReducer from "./slices/supplierSlices";
import brandsReducer from "./slices/brandSlices";
import warehousesReducer from "./slices/warehouseSlices";
import blogsReducer from "./slices/blogSlice";
import staffsReducer from "./slices/staffSlices";
import webBannerReducer from "./slices/webBannerSlice";
import staticPageReducer from "./slices/staticPageSlices";
import variantsReducer from "./slices/variantSlices";
import timetableReducer from "./slices/timetableSlices";
import customerGroupReducer from "./slices/customerGroupSlice";
import posReducer from "./slices/posSlices";

export const store = configureStore({
        reducer: {
                users: userReducer,
                auth: authReducer,
                products: productsReducer,
                categories: categoriesReducer,
                orders: ordersReducer,
                settings: settingsReducer,
                coupons: couponsReducer,
                suppliers: suppliersReducer,
                brands: brandsReducer,
                warehouses: warehousesReducer,
                blogs: blogsReducer,
                webBanners: webBannerReducer,
                staffs: staffsReducer,
                staticPages: staticPageReducer,
                variants: variantsReducer,
                timetables: timetableReducer,
                customerGroups: customerGroupReducer,
                pos: posReducer,
        },
});
