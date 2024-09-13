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

export const resetDelete = createAction('settings/resetDelete');
const initialState = {
  nav: [],
  delete: null,
  status: 'idle', 
  statusDelete: 'idle',
  error: null,
};

export const setStatus = createAction('settings/setStatus');

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

export default settingSlices.reducer;
