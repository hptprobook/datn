import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import DashboardService from "../services/dashboard.service";

export const userStatistics = createAsyncThunk(
    'dashboard/userStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardService.gets('/dashboard/users');
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const receiptStatistics = createAsyncThunk(
    'dashboard/receiptStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardService.gets('/dashboard/receipts');
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const productsStatistics = createAsyncThunk(
    'dashboard/productsStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardService.gets('/dashboard/products');
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const get7DayData = createAsyncThunk(
    'dashboard/get7DayData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardService.gets('/dashboard/orders/7day');
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    statusCreate: "idle",
    userStatistics: null,
    productsStatistics: null,
    receiptStatistics: null,
    get7DayData: null,
    status: "idle",
    statusDelete: "idle",
    error: null,
};
export const setStatus = createAction('dashboard/setStatus');
const dashboardSlices = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userStatistics.pending, (state) => {
                state.status = "loading";
            })
            .addCase(userStatistics.fulfilled, (state, action) => {
                state.status = "successful";
                state.userStatistics = action.payload;
                state.error = null;
            })
            .addCase(userStatistics.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(receiptStatistics.pending, (state) => {
                state.status = "loading";
            })
            .addCase(receiptStatistics.fulfilled, (state, action) => {
                state.status = "successful";
                state.receiptStatistics = action.payload;
                state.error = null;
            })
            .addCase(receiptStatistics.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(productsStatistics.pending, (state) => {
                state.status = "loading";
            })
            .addCase(productsStatistics.fulfilled, (state, action) => {
                state.status = "successful";
                state.productsStatistics = action.payload;
                state.error = null;
            })
            .addCase(productsStatistics.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(get7DayData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(get7DayData.fulfilled, (state, action) => {
                state.status = "successful";
                state.get7DayData = action.payload;
                state.error = null;
            })
            .addCase(get7DayData.rejected, (state, action) => {
                state.status = "failed";
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

export default dashboardSlices.reducer;
