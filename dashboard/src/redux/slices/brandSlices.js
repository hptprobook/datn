import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import BrandServices from '../services/brands.service';
/* eslint-disable */

export const fetchAll = createAsyncThunk(
  'brands/fetchAll',
  async (_, rejectWithValue) => {
    try {
      const res = await BrandServices.getAll();
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteBrand = createAsyncThunk(
  'brands/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await BrandServices.delete(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createWithImage = createAsyncThunk(
  'brands/createWithImage',
  async ({ file, data }, { rejectWithValue }) => {
    try {
      const res = await BrandServices.createWithImage({ file, data });
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const create = createAsyncThunk(
  'brands/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await BrandServices.create(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchById = createAsyncThunk(
  'brands/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await BrandServices.getById(id);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateWithImage = createAsyncThunk(
  'brands/updateWithImage',
  async ({ file, data, id }, { rejectWithValue }) => {
    try {
      return await BrandServices.updateWithImage({ file, data, id });
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const update = createAsyncThunk(
  'brands/update',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      return await BrandServices.update({ data, id });
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const setStatus = createAction('brands/setStatus');
const initialState = {
  brands: [],
  brand: {},
  delete: null,
  status: 'idle',
  statusUpdate: 'idle',
  statusDelete: 'idle',
  statusCreate: 'idle',
  statusGet: 'idle',
  error: null,
};

const brandSlices = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = 'successful';
        state.brands = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchById.pending, (state) => {
        state.statusGet = 'loading';
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.statusGet = 'successful';
        state.brand = action.payload;
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.statusGet = 'failed';
        state.error = action.payload;
      })
      .addCase(createWithImage.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createWithImage.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.brand = action.payload;
      })
      .addCase(createWithImage.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      })
      .addCase(updateWithImage.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateWithImage.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.brand = action.payload;
      })
      .addCase(updateWithImage.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.payload;
      }).addCase(update.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(update.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.brand = action.payload;
      })
      .addCase(update.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.payload;
      })
      .addCase(create.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(create.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.brand = action.payload;
      })
      .addCase(create.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteBrand.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.brands = action.payload;
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.message;
      })
      .addCase(setStatus, (state, action) => {
        const { key, value } = action.payload; // Destructure key and value from payload
        if (state[key] !== undefined) {
          state[key] = value; // Update the status field dynamically
        }
      })
  },
});

export default brandSlices.reducer;
