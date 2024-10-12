import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import BlogsService from '../services/blog.service';

export const fetchAllBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await BlogsService.getAllBlogs();
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

export const resetState = createAction('blogs/resetState');
export const setStatus = createAction('blogs/setStatus');
const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    blog: {},
    status: 'idle',
    statusUpdate: 'idle',
    error: null
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
