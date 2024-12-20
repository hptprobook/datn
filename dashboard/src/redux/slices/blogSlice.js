import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import BlogsService from '../services/blog.service';
import DashboardService from '../services/dashboard.service';

export const fetchAllBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async ({ limit = 10, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await DashboardService.gets(`/blogs?limit=${limit}&page=${page}`);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchBlogById = createAsyncThunk(
  'blogs/fetchById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await BlogsService.getBlogById(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteBlogtById = createAsyncThunk(
  'blogs/deleteBlogtById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await BlogsService.deleteBlogtById(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await BlogsService.createBlog(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createManyBlog = createAsyncThunk(
  'blogs/createMany',
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await BlogsService.createMany(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('data', data);
      const response = await BlogsService.updateBlog(id, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteManyBlog = createAsyncThunk(
  'blogs/deleteManyBlog',
  async (data, { rejectWithValue }) => {
    try {
      const response = await BlogsService.deleteMany(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetState = createAction('blogs/resetState');
export const setStatus = createAction('blogs/setStatus');
const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    blog: {},
    status: 'idle',
    statusUpdate: 'idle',
    statusDelete: 'idle',
    statusCreate: 'idle',
    error: null,
    dataCreateMany: null,
    delete: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.status = 'successful';
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.status = 'successful';
        state.blog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.dataCreate = action.payload;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      })
      .addCase(createManyBlog.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createManyBlog.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.dataCreateMany = action.payload;
      })
      .addCase(createManyBlog.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteBlogtById.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteBlogtById.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.deleteReturn = action.payload;
      })
      .addCase(deleteBlogtById.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteManyBlog.pending, (state) => {
        state.statusDelete = 'loading delete';
      })
      .addCase(deleteManyBlog.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.delete = action.payload;
      })
      .addCase(deleteManyBlog.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.update = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
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
export const { resetState: resetStateAction } = blogsSlice.actions;
export default blogsSlice.reducer;
