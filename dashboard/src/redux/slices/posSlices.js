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

const initialState = {
    orders: null,
    statusOrder: "idle",
    statusLogout: "idle",
    statusMe: "idle",
    statusSearch: "idle",
    products: null,
    error: null,
};
export const setStatus = createAction('auth/setStatus');
const posSlices = createSlice({
    name: "auth",
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
            .addCase(setStatus, (state, action) => {
                const { key, value } = action.payload; // Destructure key and value from payload
                if (state[key] !== undefined) {
                    state[key] = value; // Update the status field dynamically
                }
            });
    },
});

export default posSlices.reducer;
