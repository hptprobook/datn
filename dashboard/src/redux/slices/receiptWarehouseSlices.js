import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import DashboardService from "../services/dashboard.service";

export const createReceipt = createAsyncThunk(
    'receiptsWarehouse/createReceipt',
    async (data, { rejectWithValue }) => {
        try {
            const response = await DashboardService.create('/warehouse-receipts', data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const allReceiptWarehouses = createAsyncThunk(
    'receiptsWarehouse/allReceiptWarehouses',
    async ({
        page,
        limit
    }, { rejectWithValue }) => {
        try {
            const response = await DashboardService.gets(`/warehouse-receipts?page=${page}&limit=${limit}`);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const deleteReceiptWarehouse = createAsyncThunk(
    'receiptsWarehouse/deleteReceiptWarehouse',
    async ({
        id,
        updateAfter
    }, { rejectWithValue }) => {
        try {
            return await DashboardService.delete(`/warehouse-receipts/${id}?updateAfter=${updateAfter}`);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
const initialState = {
    statusCreate: "idle",
    receiptsWarehouse: null,
    status: "idle",
    statusDelete: "idle",
    error: null,
};
export const setStatus = createAction('receiptsWarehouse/setStatus');
const receiptWarehouseSlices = createSlice({
    name: "receiptsWarehouse",
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
            .addCase(allReceiptWarehouses.pending, (state) => {
                state.status = "loading";
            })
            .addCase(allReceiptWarehouses.fulfilled, (state, action) => {
                state.status = "successful";
                state.receiptsWarehouse = action.payload;
                state.error = null;
            })
            .addCase(allReceiptWarehouses.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteReceiptWarehouse.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(deleteReceiptWarehouse.fulfilled, (state, action) => {
                state.statusDelete = "successful";
                state.error = null;
            })
            .addCase(deleteReceiptWarehouse.rejected, (state, action) => {
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

export default receiptWarehouseSlices.reducer;
