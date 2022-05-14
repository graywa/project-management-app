import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getColumns } from '../api/columns';

interface columnsState {
  // isAuth: boolean;
  // name: string;
  // token: string;
  isLoading: boolean;
  error: string | null;
  columns: [];
}

const initialState: columnsState = {
  // isAuth: !!localStorage.getItem('token'),
  isLoading: false,
  // name: '',
  // token: localStorage.getItem('token') || '',
  error: null,
  columns: [],
};

export const modalSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {},
  extraReducers: {
    [getColumns.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = '';
      state.columns = action.payload;
    },
    [getColumns.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [getColumns.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default modalSlice.reducer;
