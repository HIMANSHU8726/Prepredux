import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ProductState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  data: null,
  loading: false,
  error: null,
};

import { api } from '../../services/api';

// ... (imports and interface remain same)

export const fetchRecentProducts = createAsyncThunk(
  'product/fetchRecentProducts',
  async (_, { rejectWithValue }) => {
    try {
      const body = {
        latitude: '28.52',
        longitude: '77.21',
      };

      // The api service handles the URL, headers (token/cookie), and response parsing!
      const json = await api.post('/recent/product', body);
      
      console.log('Redux API Service Response:', json);
      return json;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRecentProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
