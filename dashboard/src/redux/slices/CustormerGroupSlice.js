import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import CustormerGroupsService from '../services/custormerGroup.service';

export const fetchAllCG = createAsyncThunk(
  'CustormerGroups/fetchCG',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CustormerGroupsService.getAllCG();
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getOneCB = createAsyncThunk(
  'CustormerGroups/getOneCB',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await CustormerGroupsService.getOneCG(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteOneCG = createAsyncThunk(
  'CustormerGroups/deleteOneCG',
  async (id, { rejectWithValue }) => {
    try {
      const response = await CustormerGroupsService.deleteOneCG(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createCustormerGroup = createAsyncThunk(
  'CustormerGroups/createCustormerGroup',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await CustormerGroupsService.createCustormerGroup(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateCustormerGroup = createAsyncThunk(
  'CustormerGroups/updateCustormerGroup',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('data', data);
      const response = await CustormerGroupsService.updateCustormerGroup(id, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetState = createAction('CustormerGroups/resetState');
export const setStatus = createAction('CustormerGroups/setStatus');
const CustormerGroupSlice = createSlice({
  name: 'CustormerGroups',
  initialState: {
    CustormerGroups: [],
    CustormerGroup: {},
    status: 'idle',
    statusUpdate: 'idle',
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCG.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCG.fulfilled, (state, action) => {
        state.status = 'successful';
        state.CustormerGroups = action.payload;
      })
      .addCase(fetchAllCG.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getOneCB.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOneCB.fulfilled, (state, action) => {
        state.status = 'successful';
        state.CustormerGroup = action.payload;
      })
      .addCase(getOneCB.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createCustormerGroup.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createCustormerGroup.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.dataCreate = action.payload;
      })
      .addCase(createCustormerGroup.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteOneCG.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteOneCG.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.deleteReturn = action.payload;
      })
      .addCase(deleteOneCG.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCustormerGroup.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateCustormerGroup.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.update = action.payload;
      })
      .addCase(updateCustormerGroup.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.payload;
      })
      .addCase(setStatus, (state, action) => {
        const { key, value } = action.payload; // Destructure key and value from payload
        if (state[key] !== undefined) {
          state[key] = value; // Update the status field dynamically
        }
      });
  },
});
export const { resetState: resetStateAction } = CustormerGroupSlice.actions;
export default CustormerGroupSlice.reducer;
