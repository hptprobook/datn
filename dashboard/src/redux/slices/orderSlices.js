import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import OrderServices from '../services/orders.service';
import DashboardService from '../services/dashboard.service';
/* eslint-disable */

export const fetchAll = createAsyncThunk(
  'orders/fetchAll',
  async ({
    page,
    limit,
  }, rejectWithValue) => {
    try {
      const res = await DashboardService.gets(`orders?page=${page}&limit=${limit}`);
return res;
    } catch (err) {
  return rejectWithValue(err.response.data);
}
  }
);
export const fetchById = createAsyncThunk(
  'orders/fetchById',
  async (id, rejectWithValue) => {
    try {
      const res = await OrderServices.getById(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, data }, rejectWithValue) => {
    try {
      const res = await OrderServices.updateOrder(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const resetDelete = createAction('orders/resetDelete');
const initialState = {
  orders: [],
  order: null,
  delete: null,
  status: 'idle',
  statusGet: 'idle',
  statusDelete: 'idle',
  statusUpdate: 'idle',
  error: null,
};

export const setStatus = createAction('orders/setStatus');

const orderSlices = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = 'successful';
        state.orders = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchById.pending, (state) => {
        state.statusGet = 'loading';
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.statusGet = 'successful';
        state.order = action.payload;
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.statusGet = 'failed';
        state.error = action.error;
      })
      .addCase(updateOrder.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.order = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.error;
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

export default orderSlices.reducer;
