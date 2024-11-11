import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import PosService from "../services/pos.service";

export const trackingOrder = createAsyncThunk(
    'pos/trackingOrder',
    async (data, { rejectWithValue }) => {
        try {
            const response = await PosService.trackingOrder(data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const searchProduct = createAsyncThunk(
    'pos/searchProduct',
    async (data, { rejectWithValue }) => {
        try {
            const response = await PosService.searchProduct(data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const searchProducts = createAsyncThunk(
    'pos/searchProducts',
    async (data, { rejectWithValue }) => {
        try {
            const response = await PosService.searchProducts(data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const searchUser = createAsyncThunk(
    'pos/searchUser',
    async (data, { rejectWithValue }) => {
        try {
            const response = await PosService.searchUser(data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


const initialState = {
    orders: null,
    statusOrder: "idle",
    statusLogout: "idle",
    statusMe: "idle",
    statusSearch: "idle",
    statusSearchUser: "idle",
    users: null,
    products: null,
    error: null,
};
export const setStatus = createAction('pos/setStatus');
const posSlices = createSlice({
    name: "pos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(trackingOrder.pending, (state) => {
                state.statusOrder = "loading";
            })
            .addCase(trackingOrder.fulfilled, (state, action) => {
                state.statusOrder = "successful";
                state.orders = action.payload;
                state.error = null;
            })
            .addCase(trackingOrder.rejected, (state, action) => {
                state.statusOrder = "failed";
                state.error = action.payload;
            })
            .addCase(searchProduct.pending, (state) => {
                state.statusSearch = "loading";
            })
            .addCase(searchProduct.fulfilled, (state, action) => {
                state.statusSearch = "successful";
                state.products = action.payload;
                state.error = null;
            })
            .addCase(searchProduct.rejected, (state, action) => {
                state.statusSearch = "failed";
                state.error = action.payload;
            })
            .addCase(searchProducts.pending, (state) => {
                state.statusSearch = "loading";
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.statusSearch = "successful";
                state.products = action.payload;
                state.error = null;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.statusSearch = "failed";
                state.error = action.payload;
            })
            .addCase(searchUser.pending, (state) => {
                state.statusSearchUser = "loading";
            })
            .addCase(searchUser.fulfilled, (state, action) => {
                state.statusSearchUser = "successful";
                state.users = action.payload;
                state.error = null;
            })
            .addCase(searchUser.rejected, (state, action) => {
                state.statusSearchUser = "failed";
                state.error = action.payload;
            })
            .addCase(setStatus, (state, action) => {
                const { key, value } = action.payload; // Destructure key and value from payload
                if (state[key] !== undefined) {
                    state[key] = value; // Update the status field dynamically
                }
            });
    },
});

export default posSlices.reducer;
