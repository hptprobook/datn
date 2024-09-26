import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import CategoryService from '../services/category.service';
/* eslint-disable */

export const fetchAllCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, rejectWithValue) => {
    try {
      const res = await CategoryService.getAllCategories();
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const res = await CategoryService.getCategoryById(categoryId);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async ({ data, image }, thunkAPI) => {
    try {
      const res = await CategoryService.createCategory({data: image, additionalData: data});

      return res.data; // Assuming res.data contains the categories array
    } catch (error) {
      throw error;
    }
  }
);
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await CategoryService.deleteCategory(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data.errors);
    }
  }
);
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await CategoryService.updateCategory(id, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data.errors);
    }
  }
);

export const resetDelete = createAction('categories/resetDelete');
const initialState = {
  categories: [],
  selectedCategory: null,
  delete: null,
  status: 'idle', // 'idle' | 'loading' | 'successful' | 'failed'
  statusDelete: 'idle',
  error: null,
};

export const setStatus = createAction('categories/setStatus');

const categorySlices = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.status = 'successful';
        state.categories = action.payload; // Storing only the categories array
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.status = 'successful';
        state.selectedCategory = action.payload; // Storing the details of a specific category
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCategory.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.newCategory = action.payload; // Update based on the actual structure
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.statusDelete = 'loading delete';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.delete = action.payload; // Storing only the categories array
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.dataUpdate = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.error.message;
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

export default categorySlices.reducer;
