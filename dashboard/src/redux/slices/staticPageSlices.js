import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import StaticPageService from "../services/staticPages.service";
import DashboardService from "../services/dashboard.service";

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
export const createStaticPage = createAsyncThunk(
    "staticPages/create",
    async (data, { rejectWithValue }) => {
        try {
            return await StaticPageService.create(data);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const createsStaticPage = createAsyncThunk(
    "staticPages/creates",
    async (data, { rejectWithValue }) => {
        try {
            return await DashboardService.create('/static-pages/creates', data);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const deletesStaticPage = createAsyncThunk(
    "staticPages/deletes",
    async (data, { rejectWithValue }) => {
        try {
            return await DashboardService.create('/static-pages/deletes', data);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const getPageBy = createAsyncThunk(
    "staticPages/findOne",
    async ({ type, value }, { rejectWithValue }) => {
        try {
            const response = await StaticPageService.findOne({
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
export const updatePageById = createAsyncThunk(
    "staticPages/updatePageById",
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
    deletes: null,
    creates: null,
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
            .addCase(createStaticPage.pending, (state) => {
                state.statusCreate = "loading";
            })
            .addCase(createStaticPage.fulfilled, (state, action) => {
                state.statusCreate = "successful";
            })
            .addCase(createStaticPage.rejected, (state, action) => {
                state.statusCreate = "failed";
                state.error = action.payload;
            })
            .addCase(createsStaticPage.pending, (state) => {
                state.statusCreate = "loading";
            })
            .addCase(createsStaticPage.fulfilled, (state, action) => {
                state.statusCreate = "successful";
                state.creates = action.payload;
            })
            .addCase(createsStaticPage.rejected, (state, action) => {
                state.statusCreate = "failed";
                state.creates = action.payload;
            })
            .addCase(getPageBy.pending, (state) => {
                state.statusGet = "loading";
            })
            .addCase(getPageBy.fulfilled, (state, action) => {
                state.statusGet = "successful";
                state.page = action.payload;
            })
            .addCase(getPageBy.rejected, (state, action) => {
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
            .addCase(deletesStaticPage.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(deletesStaticPage.fulfilled, (state, action) => {
                state.statusDelete = "successful";
                state.deletes = action.payload;
            })
            .addCase(deletesStaticPage.rejected, (state, action) => {
                state.statusDelete = "failed";
                state.deletes = action.payload;
            })
            .addCase(updatePageById.pending, (state) => {
                state.statusUpdate = "loading";
            })
            .addCase(updatePageById.fulfilled, (state, action) => {
                state.statusUpdate = "successful";
                state.staff = action.payload;
            })
            .addCase(updatePageById.rejected, (state, action) => {
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
