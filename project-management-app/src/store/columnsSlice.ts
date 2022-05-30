import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addColumns,
  changeColumnsOrder,
  deleteColumn,
  getColumns,
  updateColumn,
} from '../api/columns';
import { IColumn } from '../models/IColumn';

interface columnsState {
  boardId: string;
  isLoading: boolean;
  isCreateColumn: boolean;
  errorColumn: string | null;
  columns: IColumn[];
}

const initialState: columnsState = {
  boardId: localStorage.getItem('boardId') || '',
  isLoading: false,
  isCreateColumn: false,
  errorColumn: null,
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
    setColumns(state, action) {
      state.columns = action.payload;
    },
    resetCreateNewColumn(state) {
      state.isCreateColumn = false;
    },
    clearColumns(state) {
      state.columns = [];
    },
  },
  extraReducers: {
    [getColumns.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorColumn = '';
      state.columns = action.payload.sort((a: IColumn, b: IColumn) => a.order - b.order);
    },
    [getColumns.pending.type]: (state) => {
      state.errorColumn = '';
      state.isLoading = true;
    },
    [getColumns.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorColumn = action.payload;
    },
    [addColumns.fulfilled.type]: (state, action: PayloadAction<IColumn>) => {
      state.isLoading = false;
      state.isCreateColumn = true;
      state.errorColumn = '';
      state.columns.push(action.payload);
    },
    [addColumns.pending.type]: (state) => {
      state.errorColumn = '';
      state.isLoading = true;
    },
    [addColumns.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorColumn = action.payload;
    },
    [updateColumn.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorColumn = '';
      const { id } = action.payload;
      state.columns[state.columns.findIndex((column) => column.id === id)] = action.payload;
    },
    [updateColumn.pending.type]: (state) => {
      state.errorColumn = '';
      state.isLoading = true;
    },
    [updateColumn.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorColumn = action.payload;
    },
    [deleteColumn.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorColumn = '';
      const id = action.payload;
      state.columns = state.columns.filter((el) => el.id !== id);
    },
    [deleteColumn.pending.type]: (state) => {
      state.errorColumn = '';
      state.isLoading = true;
    },
    [deleteColumn.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorColumn = action.payload;
    },
    [changeColumnsOrder.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorColumn = '';
      state.columns = action.payload?.sort((a: IColumn, b: IColumn) => a.order - b.order);
    },
    [changeColumnsOrder.pending.type]: (state) => {
      state.errorColumn = '';
      state.isLoading = true;
    },
    [changeColumnsOrder.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorColumn = action.payload;
    },
  },
});

export const { changeBoardId, resetCreateNewColumn, setColumns, clearColumns } =
  columnsSlice.actions;

export default columnsSlice.reducer;
