import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import VariantService from "../services/variants.service";

export const fetchAllVariants = createAsyncThunk(
    "variants/fetchAllVariants",
    async (_, { rejectWithValue }) => {
        try {
            const response = await VariantService.all();
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const createStaticPage = createAsyncThunk(
    "variants/create",
    async (data, { rejectWithValue }) => {
        try {
            return await VariantService.create(data);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const getPageBy = createAsyncThunk(
    "variants/findOne",
    async ({ type, value }, { rejectWithValue }) => {
        try {
            const response = await VariantService.findOne({
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
    "variants/deleteStaticPage",
    async (id, { rejectWithValue }) => {
        try {
            return await VariantService.delete(id);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const updatePageById = createAsyncThunk(
    "variants/updatePageById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await VariantService.update(id, data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
const initialState = {
    variants: [],
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
    name: "variants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllVariants.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllVariants.fulfilled, (state, action) => {
                state.status = "successful";
                state.variants = action.payload;
            })
            .addCase(fetchAllVariants.rejected, (state, action) => {
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
