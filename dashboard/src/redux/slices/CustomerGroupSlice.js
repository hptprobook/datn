import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import customerGroupsService from '../services/customerGroup.service';

export const fetchAllCustomerGroup = createAsyncThunk(
  'customerGroups/fetchCG',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerGroupsService.getAllCustomerGroup();
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getOneCustomerGroup = createAsyncThunk(
  'customerGroups/getOneCustomerGroup',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await customerGroupsService.getOneCustomerGroup(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteOneCustomerGroup = createAsyncThunk(
  'customerGroups/deleteOneCustomerGroup',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerGroupsService.deleteOneCustomerGroup(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createCustomerGroup = createAsyncThunk(
  'customerGroups/createCustomerGroup',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await customerGroupsService.createCustomerGroup(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateCustomerGroup = createAsyncThunk(
  'customerGroups/updateCustomerGroup',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await customerGroupsService.updateCustomerGroup(id, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const addCustomerToGroup = createAsyncThunk(
  'customerGroups/addCustomerToGroup',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await customerGroupsService.addCustomerToGroup(id, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const removeCustomerFromGroup = createAsyncThunk(
  'customerGroups/removeCustomerFromGroup',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await customerGroupsService.removeCustomerFromGroup(id, userId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetState = createAction('customerGroups/resetState');
export const setStatus = createAction('customerGroups/setStatus');
const customerGroupSlice = createSlice({
  name: 'customerGroups',
  initialState: {
    customerGroups: [],
    customerGroup: {},
    status: 'idle',
    statusUpdate: 'idle',
    statusAdd: 'idle',
    statusRemove: 'idle',
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomerGroup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCustomerGroup.fulfilled, (state, action) => {
        state.status = 'successful';
        state.customerGroups = action.payload;
      })
      .addCase(fetchAllCustomerGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getOneCustomerGroup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOneCustomerGroup.fulfilled, (state, action) => {
        state.status = 'successful';
        state.customerGroup = action.payload;
      })
      .addCase(getOneCustomerGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createCustomerGroup.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createCustomerGroup.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.dataCreate = action.payload;
      })
      .addCase(createCustomerGroup.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteOneCustomerGroup.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteOneCustomerGroup.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.deleteReturn = action.payload;
      })
      .addCase(deleteOneCustomerGroup.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCustomerGroup.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateCustomerGroup.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.update = action.payload;
      })
      .addCase(updateCustomerGroup.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.payload;
      })
      .addCase(addCustomerToGroup.pending, (state) => {
        state.statusAdd = 'loading';
      })
      .addCase(addCustomerToGroup.fulfilled, (state, action) => {
        state.statusAdd = 'successful';
        state.add = action.payload;
      })
      .addCase(addCustomerToGroup.rejected, (state, action) => {
        state.statusAdd = 'failed';
        state.error = action.payload;
      })
      .addCase(removeCustomerFromGroup.pending, (state) => {
        state.statusRemove = 'loading';
      })
      .addCase(removeCustomerFromGroup.fulfilled, (state, action) => {
        state.statusRemove = 'successful';
        state.remove = action.payload;
      })
      .addCase(removeCustomerFromGroup.rejected, (state, action) => {
        state.statusRemove = 'failed';
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
export const { resetState: resetStateAction } = customerGroupSlice.actions;
export default customerGroupSlice.reducer;
