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
export const createNav = createAsyncThunk(
  'settings/createNav',
  async ({ values }, { rejectWithValue }) => {
    try {
      const res = await SettingServices.addNav(values);
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
export const getNavById = createAsyncThunk(
  'settings/getNavById',
  async ({ id }, rejectWithValue) => {
    try {
      const res = await SettingServices.getNavById(id);
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
export const updateMutipleNav = createAsyncThunk(
  'settings/updateMutipleNav',
  async ({ values }, rejectWithValue) => {
    try {
      const res = await SettingServices.updateMutipleNav(values);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getConfigWebsite = createAsyncThunk(
  'settings/web',
  async (_, rejectWithValue) => {
    try {
      return await SettingServices.getConfigWebsite();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const resetDelete = createAction('settings/resetDelete');
const initialState = {
  navs: [],
  nav: {},
  web: {},
  delete: null,
  status: 'idle',
  statusWeb: 'idle',
  statusDelete: 'idle',
  statusUpdate: 'idle',
  statusCreate: 'idle',
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
        state.navs = action.payload;
      })
      .addCase(fetchNav.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(removeNav.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(removeNav.fulfilled, (state, action) => {
        state.statusDelete = 'succeeded';
        state.navs = action.payload;
      })
      .addCase(removeNav.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload.message;
      })
      .addCase(updateNav.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateNav.fulfilled, (state, action) => {
        state.statusUpdate = 'succeeded';
        state.navs = action.payload;
      })
      .addCase(updateNav.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.payload.message;
      })
      .addCase(updateMutipleNav.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateMutipleNav.fulfilled, (state, action) => {
        state.statusUpdate = 'succeeded';
        state.navs = action.payload;
      })
      .addCase(updateMutipleNav.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.payload.message;
      })
      .addCase(createNav.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createNav.fulfilled, (state, action) => {
        state.statusCreate = 'succeeded';
        state.nav = action.payload;
      })
      .addCase(createNav.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload.message;
      })
      .addCase(getNavById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getNavById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nav = action.payload;
      })
      .addCase(getNavById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(getConfigWebsite.pending, (state) => {
        state.statusWeb = 'loading';
      })
      .addCase(getConfigWebsite.fulfilled, (state, action) => {
        state.statusWeb = 'succeeded';
        state.web = action.payload;
      })
      .addCase(getConfigWebsite.rejected, (state, action) => {
        state.statusWeb = 'failed';
        state.error = action.payload;
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
        state.statusDelete = 'idle';
        state.statusUpdate = 'idle';
        state.statusCreate = 'idle';
        state.error = null;
      });
  },
});

export default settingSlices.reducer;
