import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import CouponServices from '../services/coupon.service';
import DashboardService from '../services/dashboard.service';
/* eslint-disable */

export const fetchAll = createAsyncThunk(
  'coupons/fetchAll',
  async ({
    page,
    limit,
  }, rejectWithValue) => {
    try {
      const res = await DashboardService.gets(`/coupons?page=${page}&limit=${limit}`);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchOne = createAsyncThunk(
  'coupons/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await DashboardService.gets(`/coupons/${id}`);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchHistory = createAsyncThunk(
  'coupons/fetchHistory',
  async (couponId, { rejectWithValue }) => {
    try {
      const res = await DashboardService.gets(`/coupon-history?couponId=${couponId}`);
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

export const update = createAsyncThunk(
  'coupons/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await CouponServices.update(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data.errors);
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
export const deleteManyCoupon = createAsyncThunk(
  'coupons/deleteManyCoupon',
  async (data, { rejectWithValue }) => {
    try {
      const response = await CouponServices.deleteMany(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const createManyCoupon = createAsyncThunk(
  'webBanners/createMany',
  async ({ data }, { rejectWithValue }) => {
    try {
      console.log(data);
      const res = await CouponServices.createMany(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



export const setStatus = createAction('coupons/setStatus');
export const resetDelete = createAction('coupons/resetDelete');
const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    coupons: [],
    coupon: {},
    delete: null,
    history: [],
    status: 'idle',
    statusHistory: 'idle',
    statusUpdate: 'idle',
    statusDelete: 'idle',
    statusCreate: 'idle',
    error: null,
    dataCreateMany: null,

  },
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
      .addCase(fetchHistory.pending, (state) => {
        state.statusHistory = 'loading';
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.statusHistory = 'successful';
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.statusHistory = 'failed';
        state.error = action.error;
      })
      .addCase(fetchOne.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOne.fulfilled, (state, action) => {
        state.status = 'successful';
        state.coupon = action.payload;
      })
      .addCase(fetchOne.rejected, (state, action) => {
        state.status = 'failed';
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
      .addCase(createManyCoupon.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createManyCoupon.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.dataCreateMany = action.payload;
      })
      .addCase(createManyCoupon.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      })
      .addCase(update.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(update.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.update = action.payload;
      })
      .addCase(update.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.delete = action.payload; // Storing only the categories array
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteManyCoupon.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteManyCoupon.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.delete = action.payload; // Storing only the categories array
      })
      .addCase(deleteManyCoupon.rejected, (state, action) => {
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
