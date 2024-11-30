import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import FileManagerService from '../services/file.service';

export const getFolder = createAsyncThunk(
  'files/getFolder',
  async (_, { rejectWithValue }) => {
    try {
      const response = await FileManagerService.get();
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await FileManagerService.delete(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getFiles = createAsyncThunk(
  'files/getFiles',
  async ({
    folder,
    limit = 10
  }, { rejectWithValue }) => {
    try {
      const response = await FileManagerService.getFiles({
        folder,
        limit,
      });
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async ({
    file,
    data
  }, { rejectWithValue }) => {
    try {
      const response = await FileManagerService.upload({
        file,
        data
      });
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



export const setStatus = createAction('files/setStatus');
const fileManagerSlices = createSlice({
  name: 'files',
  initialState: {
    folders: [],
    files: [],
    statusFiles: 'idle',
    statusDelete: 'idle',
    status: 'idle',
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFolder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getFolder.fulfilled, (state, action) => {
        state.status = 'successful';
        state.folders = action.payload;
      })
      .addCase(getFolder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getFiles.pending, (state) => {
        state.statusFiles = 'loading';
      })
      .addCase(getFiles.fulfilled, (state, action) => {
        state.statusFiles = 'successful';
        state.files = action.payload;
      })
      .addCase(getFiles.rejected, (state, action) => {
        state.statusFiles = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteFile.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(uploadFile.pending, (state) => {
        state.statusUpload = 'loading';
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.statusUpload = 'successful';
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.statusUpload = 'failed';
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
export default fileManagerSlices.reducer;
