import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import WarehouseServices from '../services/warehouse.service';
/* eslint-disable */

export const fetchAll = createAsyncThunk(
  'warehouses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await WarehouseServices.getAll();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteWarehouse = createAsyncThunk(
  'warehouses/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await WarehouseServices.delete(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const createWarehouse = createAsyncThunk(
  'warehouses/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await WarehouseServices.create(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const fetchById = createAsyncThunk(
  'warehouses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await WarehouseServices.getById(id);
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const update = createAsyncThunk(
  'warehouses/update',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      return await WarehouseServices.update({ data, id });
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const setStatus = createAction('warehouses/setStatus');
const initialState = {
  warehouses: [],
  warehouse: {},
  delete: null,
  status: 'idle',
  statusUpdate: 'idle',
  statusDelete: 'idle',
  statusCreate: 'idle',
  statusGet: 'idle',
  error: null,
};

const warehouseSlices = createSlice({
  name: 'warehouses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = 'successful';
        state.warehouses = action.payload;
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
        state.warehouse = action.payload;
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.statusGet = 'failed';
        state.error = action.payload;
      })
      .addCase(createWarehouse.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
      })
      .addCase(createWarehouse.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      }).addCase(update.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(update.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.warehouse = action.payload;
      })
      .addCase(update.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteWarehouse.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.brands = action.payload;
      })
      .addCase(deleteWarehouse.rejected, (state, action) => {
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

export default warehouseSlices.reducer;
