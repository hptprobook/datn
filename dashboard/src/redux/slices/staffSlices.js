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
export const getStaffBy = createAsyncThunk(
    "staffs/getStaffBy",
    async ({ type, value }, { rejectWithValue }) => {
        try {
            const response = await StaffsService.getStaffBy({
                type,
                value,
            });
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const deleteStaff = createAsyncThunk(
    "staffs/deleteStaff",
    async (id, { rejectWithValue }) => {
        try {
            return await StaffsService.delete(id);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const updateStaffById = createAsyncThunk(
    "staffs/updateStaffById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await StaffsService.update(id, data);
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
            .addCase(getStaffBy.pending, (state) => {
                state.statusGet = "loading";
            })
            .addCase(getStaffBy.fulfilled, (state, action) => {
                state.statusGet = "successful";
                state.staff = action.payload;
            })
            .addCase(getStaffBy.rejected, (state, action) => {
                state.statusGet = "failed";
                state.error = action.payload;
            })
            .addCase(deleteStaff.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.statusDelete = "successful";
                state.delete = action.payload;
            })
            .addCase(deleteStaff.rejected, (state, action) => {
                state.statusDelete = "failed";
                state.error = action.payload;
            })
            .addCase(updateStaffById.pending, (state) => {
                state.statusUpdate = "loading";
            })
            .addCase(updateStaffById.fulfilled, (state, action) => {
                state.statusUpdate = "successful";
                state.staff = action.payload;
            })
            .addCase(updateStaffById.rejected, (state, action) => {
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
