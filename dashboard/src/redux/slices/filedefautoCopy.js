import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import CategoryService from '../services/category.service';
/* eslint-disable */

export const fetch = createAsyncThunk(
  'orders/fetchAll',
  async (_, rejectWithValue) => {
    try {
      const res = await CategoryService.getAllCategories();
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
      .addCase(fetch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.category; 
      })
      .addCase(fetch.rejected, (state, action) => {
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
