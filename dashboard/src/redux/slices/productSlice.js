import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import ProductsService from '../services/product.service';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProductsService.getAllProducts();
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await ProductsService.getProductById(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteProductById = createAsyncThunk(
  'products/deleteProductById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await ProductsService.deleteProductById(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await ProductsService.createProduct(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await ProductsService.updateProduct(id, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetState = createAction('products/resetState');
export const setStatus = createAction('products/setStatus');
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: {},
    status: 'idle',
    statusGet: 'idle',
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = 'successful';
        state.products = action.payload.products;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.statusGet = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.statusGet = 'successful';
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.statusGet = 'failed';
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.statusCreate = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.statusCreate = 'successful';
        state.dataCreate = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.statusCreate = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteProductById.pending, (state) => {
        state.statusDelete = 'loading';
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.statusDelete = 'successful';
        state.deleteReturn = action.payload;
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.statusDelete = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.statusUpdate = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.statusUpdate = 'successful';
        state.dataUpdateReturn = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
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
export const { resetState: resetStateAction } = productsSlice.actions;
export default productsSlice.reducer;
