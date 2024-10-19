import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import WebBannerServices from '../services/webBanner.service';
/* eslint-disable */

export const fetchAll = createAsyncThunk(
  'webBanners/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await WebBannerServices.getAll();
    } catch (err) {
      return rejectWithValue(err.response.data);
  }
  }
);
export const deleteWebBanner = createAsyncThunk(
  'webBanners/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await WebBannerServices.delete(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const createWebBanner = createAsyncThunk(
  'webBanners/create',
  async ({data}, { rejectWithValue }) => {
    try {
      const res = await WebBannerServices.create(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const fetchById = createAsyncThunk(
  'webBanners/fetchById',
  async ({id}, { rejectWithValue }) => {
    try {
      return await WebBannerServices.getById(id);
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const update = createAsyncThunk(
  'webBanners/update',
  async ({id , data}, { rejectWithValue }) => {
    try {
      return await WebBannerServices.update({ id , data });
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);
export const setStatus = createAction('webBanners/setStatus');
export const resetDelete = createAction('webBanners/resetDelete');

const initialState = {
  webBanners: [],
  webBanner: {},
  delete: null,
  status: 'idle',
  statusUpdate: 'idle',
  statusDelete: 'idle',
  statusCreate: 'idle',
  statusGet: 'idle',
  error: null,
};

const webBannerSlices = createSlice({
  name: 'webBanners',
  initialState,
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
        state.statusGet = 'loading';
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.statusGet = 'successful';
        state.webBanner = action.payload;
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.statusGet = 'failed';
        state.error = action.payload;
      })
      .addCase(createWebBanner.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createWebBanner.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
      })
      .addCase(createWebBanner.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      }).addCase(update.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(update.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.webBanner = action.payload;
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
      .addCase(resetDelete, (state) => {
        state.status = 'idle';
        state.statusDelete = 'idle';
        state.error = null;
      });
  },
});

export default webBannerSlices.reducer;
