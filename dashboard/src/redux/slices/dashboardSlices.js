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
const initialState = {
    statusCreate: "idle",
    userStatistics: null,
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
            .addCase(setStatus, (state, action) => {
                const { key, value } = action.payload; // Destructure key and value from payload
                if (state[key] !== undefined) {
                    state[key] = value; // Update the status field dynamically
                }
            });
    },
});

export default dashboardSlices.reducer;
