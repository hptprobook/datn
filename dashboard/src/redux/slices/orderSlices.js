import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import OrderServices from '../services/orders.service';
/* eslint-disable */

export const fetchAll = createAsyncThunk(
  'orders/fetchAll',
  async (_, rejectWithValue) => {
    try {
      const res = await OrderServices.getAll();
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetDelete = createAction('orders/resetDelete');
const initialState = {
  orders: [],
  delete: null,
  status: 'idle', 
  statusDelete: 'idle',
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
        state.status = 'succeeded';
        state.orders = action.payload; 
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(setStatus, (state, action) => {
        state.status = action.payload;
      })
      .addCase(resetDelete, (state) => {
        state.status = 'idle';
        state.statusDelete = 'idle';
        state.error = null;
      });
  },
});

export default orderSlices.reducer;
