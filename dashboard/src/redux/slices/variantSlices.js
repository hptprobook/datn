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
export const createVariant = createAsyncThunk(
    "variants/create",
    async (data, { rejectWithValue }) => {
        try {
            return await VariantService.create(data);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const manyDeleteVariant = createAsyncThunk(
    "variants/deleteMany",
    async (data, { rejectWithValue }) => {
        try {
            return await VariantService.manyDelete(data);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const deleteVariant = createAsyncThunk(
    "variants/deleteVariant",
    async (id, { rejectWithValue }) => {
        try {
            return await VariantService.delete(id);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const updateVariantById = createAsyncThunk(
    "variants/updateVariantById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await VariantService.update(id, data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const createManyVariants = createAsyncThunk(
    "variants/createManyVariants",
    async (data, { rejectWithValue }) => {
        try {
            return await VariantService.many(data);
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
    statusCreateMany: "idle",
    dataCreateMany: null,
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
            .addCase(createVariant.pending, (state) => {
                state.statusCreate = "loading";
            })
            .addCase(createVariant.fulfilled, (state, action) => {
                state.statusCreate = "successful";
            })
            .addCase(createVariant.rejected, (state, action) => {
                state.statusCreate = "failed";
                state.error = action.payload;
            })
            .addCase(createManyVariants.pending, (state) => {
                state.statusCreateMany = "loading";
            })
            .addCase(createManyVariants.fulfilled, (state, action) => {
                state.statusCreateMany = "successful";
                state.dataCreateMany = action.payload;
            })
            .addCase(createManyVariants.rejected, (state, action) => {
                state.statusCreateMany = "failed";
                state.dataCreateMany = action.payload;
            })
            .addCase(manyDeleteVariant.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(manyDeleteVariant.fulfilled, (state, action) => {
                state.statusDelete = "successful";
            })
            .addCase(manyDeleteVariant.rejected, (state, action) => {
                state.statusDelete = "failed";
                state.error = action.payload;
            })
            .addCase(deleteVariant.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(deleteVariant.fulfilled, (state, action) => {
                state.statusDelete = "successful";
            })
            .addCase(deleteVariant.rejected, (state, action) => {
                state.statusDelete = "failed";
                state.error = action.payload;
            })
            .addCase(updateVariantById.pending, (state) => {
                state.statusUpdate = "loading";
            })
            .addCase(updateVariantById.fulfilled, (state, action) => {
                state.statusUpdate = "successful";
            })
            .addCase(updateVariantById.rejected, (state, action) => {
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
