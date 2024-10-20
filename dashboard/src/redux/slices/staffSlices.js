import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import StaffsService from "../services/staffs.service";

export const fetchAllStaffs = createAsyncThunk(
    "staffs/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await StaffsService.all();
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const createStaff = createAsyncThunk(
    "staffs/create",
    async (data, { rejectWithValue }) => {
        try {
            return await StaffsService.create(data);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const fetchUserById = createAsyncThunk(
    "users/fetchById",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await StaffsService.getUser(userId);
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
            return await StaffsService.delete(userId);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const updateUserById = createAsyncThunk(
    "users/updateById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await StaffsService.editUser(id, data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
const initialState = {
    staffs: [],
    staff: null,
    delete: null,
    status: "idle", // 'idle' | 'loading' | 'successful' | 'failed'
    statusDelete: "idle",
    statusUpdate: "idle",
    statusCreate: "idle",
    statusGet: "idle",
    error: null,
};

export const setStatus = createAction('users/setStatus');

const staffSlices = createSlice({
    name: "staffs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllStaffs.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllStaffs.fulfilled, (state, action) => {
                state.status = "successful";
                state.staffs = action.payload;
            })
            .addCase(fetchAllStaffs.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createStaff.pending, (state) => {
                state.statusCreate = "loading";
            })
            .addCase(createStaff.fulfilled, (state, action) => {
                state.statusCreate = "successful";
            })
            .addCase(createStaff.rejected, (state, action) => {
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
    },
});

export default staffSlices.reducer;
