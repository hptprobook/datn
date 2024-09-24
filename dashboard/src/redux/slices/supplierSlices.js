import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import SupplierServices from '../services/suppliers.service';
/* eslint-disable */

export const fetchAll = createAsyncThunk(
  'suppliers/fetchAll',
  async (_, rejectWithValue) => {
    try {
      return await SupplierServices.getAll();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getDetail = createAsyncThunk(
  'suppliers/getDetail',
  async (id, { rejectWithValue }) => {
    try {
      return await SupplierServices.getDetail(id);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const update = createAsyncThunk(
  'suppliers/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await SupplierServices.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const create = createAsyncThunk(
  'suppliers/create',
  async (data, { rejectWithValue }) => {
    try {
      return await SupplierServices.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);
export const deleteSupplier = createAsyncThunk(
  'suppliers/deleteSupplier',
  async (data, { rejectWithValue }) => {
    try {
      return await SupplierServices.delete(data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const initialState = {
  suppliers: [],
  supplier: {},
  delete: null,
  statusGet: 'idle',
  status: 'idle',
  statusDelete: 'idle',
  statusCreate: 'idle',
  statusUpdate: 'idle',
  error: null,
};

export const setStatus = createAction('suppliers/setStatus');
export const resetDelete = createAction('suppliers/resetDelete');
const supplierSlices = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = 'successful';
        state.suppliers = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(getDetail.pending, (state) => {
        state.statusGet = 'loading';
      })
      .addCase(getDetail.fulfilled, (state, action) => {
        state.statusGet = 'successful';
        state.supplier = action.payload;
      })
      .addCase(getDetail.rejected, (state, action) => {
        state.statusGet = 'failed';
        state.error = action.payload;
      })
      .addCase(update.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(update.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.supplier = action.payload;
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
      })
      .addCase(create.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteSupplier.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(setStatus, (state, action) => {
        const { key, value } = action.payload; // Destructure key and value from payload
        if (state[key] !== undefined) {
          state[key] = value; // Update the status field dynamically
        }
      })
      .addCase(resetDelete, (state) => {
        state.status = 'idle';
        state.statusDelete = 'idle';
        state.error = null;
      });
  },
});

export default supplierSlices.reducer;
