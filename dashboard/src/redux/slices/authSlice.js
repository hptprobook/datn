import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../services/auth.service";

export const handleLogin = createAsyncThunk(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await AuthService.login(data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
const initialState = {
    auth: {},
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

export const setStatus = createAction('users/setStatus');

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(handleLogin.pending, (state) => {
                state.status = "loading";
            })
            .addCase(handleLogin.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.auth = action.payload;
            })
            .addCase(handleLogin.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;
