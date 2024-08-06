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
export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            return await UserService.delete(userId);
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
export const resetDelete = createAction('users/resetDelete');
const initialState = {
    users: [],
    selectedUser: null,
    delete: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    statusDelete: "idle",
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
            .addCase(deleteUser.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.statusDelete = "succeeded";
                state.delete = action.payload;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.statusDelete = "failed";
                state.error = action.payload;
            })
            .addCase(setStatus, (state, action) => {
                state.status = action.payload;
            })
            .addCase(resetDelete, (state) => {
                state.status = "idle";
                state.statusDelete = "idle";
                state.error = null;
            });
    },
});

export default userSlice.reducer;
