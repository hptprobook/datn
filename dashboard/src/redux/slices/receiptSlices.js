import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import DashboardService from "../services/dashboard.service";

export const createReceipt = createAsyncThunk(
    'receipts/createReceipt',
    async (data, { rejectWithValue }) => {
        try {
            const response = await DashboardService.create('/receipts', data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    orders: null,
    statusCreate: "idle",
    statusSearch: "idle",
    statusSearchUser: "idle",
    users: null,
    products: null,
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
            .addCase(setStatus, (state, action) => {
                const { key, value } = action.payload; // Destructure key and value from payload
                if (state[key] !== undefined) {
                    state[key] = value; // Update the status field dynamically
                }
            });
    },
});

export default receiptSlices.reducer;
