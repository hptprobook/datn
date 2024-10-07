import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import CouponServices from '../services/coupon.service';
/* eslint-disable */

export const fetchAll = createAsyncThunk(
  'coupons/fetchAll',
  async (_, rejectWithValue) => {
    try {
      const res = await CouponServices.getAll();
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const create = createAsyncThunk(
  'coupons/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await CouponServices.create(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async (id, { rejectWithValue }) => {
    try {
      const response = await CouponServices.delete(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data.errors);
    }
  }
);

const initialState = {
  coupons: [],
  delete: null,
  status: 'idle',
  statusDelete: 'idle',
  statusCreate: 'idle',
  error: null,
};

export const setStatus = createAction('coupons/setStatus');
export const resetDelete = createAction('coupons/resetDelete');
const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = 'successful';
        state.coupons = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
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
      .addCase(deleteCoupon.pending, (state) => {
        state.statusDelete = 'loading delete';
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.delete = action.payload; // Storing only the categories array
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
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

export default couponSlice.reducer;
