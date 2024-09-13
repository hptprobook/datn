import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import SettingServices from '../services/settings.service';
/* eslint-disable */

export const fetchNav = createAsyncThunk(
  'settings/fetchNav',
  async (_, rejectWithValue) => {
    try {
      const res = await SettingServices.getNav();
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const removeNav = createAsyncThunk(
  'settings/removeNav',
  async ({ id }, rejectWithValue) => {
    try {
      const res = await SettingServices.removeNav(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateNav = createAsyncThunk(
  'settings/updateNav',
  async ({ id, values }, rejectWithValue) => {
    try {
      const res = await SettingServices.updateNav(id, values);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetDelete = createAction('settings/resetDelete');
const initialState = {
  nav: [],
  delete: null,
  status: 'idle',
  statusDelete: 'idle',
  statusUpdate: 'idle',
  error: null,
};

export const setStatus = createAction('settings/setStatus');
export const resetStatus = createAction('settings/resetStatus');

const settingSlices = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNav.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNav.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nav = action.payload;
      })
      .addCase(fetchNav.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(removeNav.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(removeNav.fulfilled, (state, action) => {
        state.statusDelete = 'succeeded';
        state.nav = action.payload;
      })
      .addCase(removeNav.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateNav.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateNav.fulfilled, (state, action) => {
        state.statusUpdate = 'succeeded';
        state.nav = action.payload;
      })
      .addCase(updateNav.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.error.message;
      })
      .addCase(setStatus, (state, action) => {
        state.status = action.payload;
      })
      .addCase(resetDelete, (state) => {
        state.status = 'idle';
        state.statusDelete = 'idle';
        state.error = null;
      })
      .addCase(resetStatus, (state) => {
        state.status = 'idle';
        state.statusDelete = 'idle';
        state.statusUpdate = 'idle';
        state.error = null;
      });
  },
});

export default settingSlices.reducer;
