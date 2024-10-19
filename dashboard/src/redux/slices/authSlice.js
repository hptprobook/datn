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
export const getMe = createAsyncThunk(
    'auth/me',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AuthService.getMe();
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
    auth: null,
    status: "idle",
    statusLogout: "idle",
    statusMe: "idle",
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
                state.error = null;
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
                state.auth = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.statusLogout = "failed";
                state.error = action.payload;
                state.status = "idle";
                state.auth = null;
            })
            .addCase(getMe.pending, (state) => {
                state.statusMe = "loading";
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.statusMe = "successful";
                state.auth = action.payload;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.statusMe = "failed";
                state.error = action.payload;
            })
            .addCase(resetLogin, (state) => {
                state.status = "idle";
                state.auth = null;
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
