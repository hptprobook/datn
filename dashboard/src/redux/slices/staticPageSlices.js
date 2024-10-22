import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import StaticPageService from "../services/staticPages.service";

export const fetchAllPages = createAsyncThunk(
    "staticPages/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await StaticPageService.all();
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const createStaff = createAsyncThunk(
    "staticPages/create",
    async (data, { rejectWithValue }) => {
        try {
            return await StaticPageService.create(data);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const getStaffBy = createAsyncThunk(
    "staticPages/getStaffBy",
    async ({ type, value }, { rejectWithValue }) => {
        try {
            const response = await StaticPageService.getStaffBy({
                type,
                value,
            });
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const deleteStaticPage = createAsyncThunk(
    "staticPages/deleteStaticPage",
    async (id, { rejectWithValue }) => {
        try {
            return await StaticPageService.delete(id);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const updateStaffById = createAsyncThunk(
    "staticPages/updateStaffById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await StaticPageService.update(id, data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
const initialState = {
    pages: [],
    page: null,
    delete: null,
    status: "idle", // 'idle' | 'loading' | 'successful' | 'failed'
    statusDelete: "idle",
    statusUpdate: "idle",
    statusCreate: "idle",
    statusGet: "idle",
    error: null,
};

export const setStatus = createAction('users/setStatus');

const staticPageSlices = createSlice({
    name: "staticPages",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPages.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllPages.fulfilled, (state, action) => {
                state.status = "successful";
                state.pages = action.payload;
            })
            .addCase(fetchAllPages.rejected, (state, action) => {
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
            .addCase(deleteStaticPage.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(deleteStaticPage.fulfilled, (state, action) => {
                state.statusDelete = "successful";
                state.delete = action.payload;
            })
            .addCase(deleteStaticPage.rejected, (state, action) => {
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

export default staticPageSlices.reducer;
