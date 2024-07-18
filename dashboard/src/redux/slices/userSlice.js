import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "../services/user.service";

export const fetchAllUsers = createAsyncThunk(
    "users/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await UserService.getAllUsers();
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const fetchUserById = createAsyncThunk(
    "users/fetchById",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await UserService.getUser(userId);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateUserById = createAsyncThunk(
    "users/updateById",
    async ({ userId, data }, { rejectWithValue }) => {
        try {
            const response = await UserService.editUser(userId, data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    users: [],
    selectedUser: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

export const setStatus = createAction('users/setStatus');

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchUserById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(updateUserById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateUserById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedUser = action.payload;
            })
            .addCase(updateUserById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(setStatus, (state, action) => {
                state.status = action.payload;
            });
    },
});

export default userSlice.reducer;
