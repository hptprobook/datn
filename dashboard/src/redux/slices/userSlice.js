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
export const createUser = createAsyncThunk(
    "users/create",
    async (data, { rejectWithValue }) => {
        try {
            return await UserService.create(data);
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
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await UserService.editUser(id, data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const resetDelete = createAction('users/resetDelete');
const initialState = {
    users: [],
    user: null,
    delete: null,
    status: "idle", // 'idle' | 'loading' | 'successful' | 'failed'
    statusDelete: "idle",
    statusUpdate: "idle",
    statusCreate: "idle",
    statusGet: "idle",
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
                state.status = "successful";
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createUser.pending, (state) => {
                state.statusCreate = "loading";
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.statusCreate = "successful";
            })
            .addCase(createUser.rejected, (state, action) => {
                state.statusCreate = "failed";
                state.error = action.payload;
            })
            .addCase(fetchUserById.pending, (state) => {
                state.statusGet = "loading";
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.statusGet = "successful";
                state.user = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.statusGet = "failed";
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.statusDelete = "successful";
                state.delete = action.payload;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.statusDelete = "failed";
                state.error = action.payload;
            })
            .addCase(updateUserById.pending, (state) => {
                state.statusUpdate = "loading";
            })
            .addCase(updateUserById.fulfilled, (state, action) => {
                state.statusUpdate = "successful";
                state.user = action.payload;
            })
            .addCase(updateUserById.rejected, (state, action) => {
                state.statusUpdate = "failed";
                state.error = action.payload;
            })
            .addCase(setStatus, (state, action) => {
                const { key, value } = action.payload; // Destructure key and value from payload
                if (state[key] !== undefined) {
                    state[key] = value; // Update the status field dynamically
                }
            })
            .addCase(resetDelete, (state) => {
                state.status = "idle";
                state.statusDelete = "idle";
                state.error = null;
            });
    },
});

export default userSlice.reducer;
