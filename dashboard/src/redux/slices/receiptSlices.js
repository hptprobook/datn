import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import DashboardService from "../services/dashboard.service";

export const createReceipt = createAsyncThunk(
    'receipts/createReceipt',
    async (data, { rejectWithValue }) => {
        try {
            const response = await DashboardService.create('/receipts', data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response);
        }
    }
);
export const fetchAllReceipts = createAsyncThunk(
    'receipts/fetchAllReceipts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardService.gets('/receipts?page=1&limit=1000');
            return response;
        } catch (err) {
            return rejectWithValue(err.response);
        }
    }
);
export const deleteReceipt = createAsyncThunk(
    'receipts/deleteReceipt',
    async (id, { rejectWithValue }) => {
        try {
            const response = await DashboardService.delete(`/receipts/${id}`);
            return response;
        } catch (err) {
            return rejectWithValue(err.response);
        }
    }
);
const initialState = {
    statusCreate: "idle",
    receipts: null,
    status: "idle",
    statusDelete: "idle",
    error: null,
};
export const setStatus = createAction('receipts/setStatus');
const receiptSlices = createSlice({
    name: "receipts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createReceipt.pending, (state) => {
                state.statusCreate = "loading";
            })
            .addCase(createReceipt.fulfilled, (state, action) => {
                state.statusCreate = "successful";
                state.error = null;
            })
            .addCase(createReceipt.rejected, (state, action) => {
                state.statusCreate = "failed";
                state.error = action.payload;
            })
            .addCase(fetchAllReceipts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllReceipts.fulfilled, (state, action) => {
                state.status = "successful";
                state.receipts = action.payload;
                state.error = null;
            })
            .addCase(fetchAllReceipts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteReceipt.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(deleteReceipt.fulfilled, (state, action) => {
                state.statusDelete = "successful";
                state.error = null;
            })
            .addCase(deleteReceipt.rejected, (state, action) => {
                state.statusDelete = "failed";
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

export default receiptSlices.reducer;
