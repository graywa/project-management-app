import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addColumns, deleteColumn, getColumns } from '../api/columns';
import { IColumn } from '../models/IColumn';

interface columnsState {
  boardId: string;
  isLoading: boolean;
  error: string | null;
  columns: IColumn[];
}

const initialState: columnsState = {
  boardId: localStorage.getItem('boardId') || '',
  isLoading: false,
  error: null,
  columns: [],
};

export const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    changeBoardId(state, action: PayloadAction<string>) {
      localStorage.setItem('boardId', action.payload);
      state.boardId = action.payload;
    },
  },
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
    [addColumns.fulfilled.type]: (state, action: PayloadAction<IColumn>) => {
      state.isLoading = false;
      state.error = '';
      state.columns.push(action.payload);
    },
    [addColumns.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [addColumns.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteColumn.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = '';
      const id = action.payload;
      state.columns = state.columns.filter((el) => el.id !== id);
    },
    [deleteColumn.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [deleteColumn.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { changeBoardId } = columnsSlice.actions;

export default columnsSlice.reducer;
