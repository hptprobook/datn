import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import WebBannerService from '../services/webBanner.service';
/* eslint-disable */

export const fetchAll = createAsyncThunk(
  'webBanners/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await WebBannerService.getAll();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteWebBanner = createAsyncThunk(
  'webBanners/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await WebBannerService.delete(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const createWebBanner = createAsyncThunk(
  'webBanners/create',
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await WebBannerService.create(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const fetchById = createAsyncThunk(
  'webBanners/fetchById',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await WebBannerService.getById(id);
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const update = createAsyncThunk(
  'webBanners/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('data', data);
      const res = await WebBannerService.update({ id, data });
      return res; // Ensure that the response data is returned correctly
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const resetState = createAction('webBanners/resetState');
export const setStatus = createAction('webBanners/setStatus');

const webBannerSlice = createSlice({
  name: 'webBanners',
  initialState: {
    webBanners: [],
    webBanner: {},
    delete: null,
    status: 'idle',
    statusUpdate: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = 'successful';
        state.webBanners = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.status = 'successful';
        state.webBanner = action.payload;
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createWebBanner.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createWebBanner.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.dataCreate = action.payload;
      })
      .addCase(createWebBanner.rejected, (state, action) => {
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
      .addCase(deleteWebBanner.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteWebBanner.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.webBanners = action.payload;
      })
      .addCase(deleteWebBanner.rejected, (state, action) => {
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

export const { resetState: resetStateAction } = webBannerSlice.actions;
export default webBannerSlice.reducer;