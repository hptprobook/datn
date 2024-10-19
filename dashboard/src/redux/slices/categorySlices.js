import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import CategoryService from '../services/category.service';
/* eslint-disable */

export const fetchAllCategories = createAsyncThunk(
  'categories/fetchAll',
  async (parent, rejectWithValue) => {
    try {
      if (parent) {
        const res = await CategoryService.getCategoriesParent();
        return res;
      }
      const res = await CategoryService.getAllCategories();
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await CategoryService.getCategoryById(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async ({ file, data }, { rejectWithValue }) => {
    try {
      return await CategoryService.createCategory({ file, additionalData: data });
    } catch (error) {
      return rejectWithValue(err.response.data);
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
export const deleteManyCategory = createAsyncThunk(
  'categories/deleteManyCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoryService.deleteMany(data);
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
export const updateWithImage = createAsyncThunk(
  'categories/updateWithImage',
  async ({ file, data, id }, { rejectWithValue }) => {
    try {
      const response = await CategoryService.updateWithImage({ file, data, id });
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
  category: {},
  update: {},
  delete: null,
  status: 'idle',
  statusDelete: 'idle',
  statusUpdate: 'idle',
  statusCreate: 'idle',
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
        state.category = action.payload; // Storing the details of a specific category
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
        state.category = action.payload; // Update based on the actual structure
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
      .addCase(deleteManyCategory.pending, (state) => {
        state.statusDelete = 'loading delete';
      })
      .addCase(deleteManyCategory.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.delete = action.payload;
      })
      .addCase(deleteManyCategory.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.update = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.error;
      })
      .addCase(updateWithImage.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateWithImage.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.update = action.payload;
      })
      .addCase(updateWithImage.rejected, (state, action) => {
        state.statusUpdate = 'failed';
        state.error = action.error;
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
