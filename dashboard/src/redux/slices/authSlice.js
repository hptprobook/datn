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
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AuthService.logout();
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    auth: {},
    status: "idle", 
    statusLogout: "idle",
    error: null,
};
export const resetLogin = createAction('auth/resetLogin');
export const setStatus = createAction('auth/setStatus');
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
                state.status = "successful";
                state.auth = action.payload;
            })
            .addCase(handleLogin.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(logout.pending, (state) => {
                state.statusLogout = "loading";
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.statusLogout = "successful";
                state.status = "idle";
                state.auth = {};
            })
            .addCase(logout.rejected, (state, action) => {
                state.statusLogout = "failed";
                state.error = action.payload;
                state.status = "idle";
                state.auth = {};
            })
            .addCase(resetLogin, (state) => {
                state.status = "idle";
                state.auth = {};
                state.error = null;
            })
            .addCase(setStatus, (state, action) => {
                const { key, value } = action.payload; // Destructure key and value from payload
                if (state[key] !== undefined) {
                    state[key] = value; // Update the status field dynamically
                }
            });
    },
});

export default authSlice.reducer;
