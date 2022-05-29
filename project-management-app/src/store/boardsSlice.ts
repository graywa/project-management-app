import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createBoard, deleteBoard, getBoards } from '../api/boards';

interface IBoard {
  id: string;
  title: string;
}

interface boardsState {
  boards: IBoard[];
  isLoading: boolean;
  isCreateBoard: boolean;
  errorBoard: string;
}

const initialState: boardsState = {
  boards: [],
  isLoading: false,
  isCreateBoard: false,
  errorBoard: '',
};

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    resetCreateNewBoard(state) {
      state.isCreateBoard = false;
    },
    resetNewBoardError(state) {
      state.errorBoard = '';
    },
  },
  extraReducers: {
    [createBoard.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.isCreateBoard = true;
      state.errorBoard = '';
      state.boards.push(action.payload);
    },
    [createBoard.pending.type]: (state) => {
      state.errorBoard = '';
      state.isLoading = true;
    },
    [createBoard.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorBoard = action.payload;
    },
    [getBoards.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorBoard = '';
      state.boards = action.payload;
    },
    [getBoards.pending.type]: (state) => {
      state.errorBoard = '';
      state.isLoading = true;
    },
    [getBoards.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorBoard = action.payload;
    },
    [deleteBoard.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorBoard = '';
      const id = action.payload;
      state.boards = state.boards.filter((el) => el.id !== id);
    },
    [deleteBoard.pending.type]: (state) => {
      state.errorBoard = '';
      state.isLoading = true;
    },
    [deleteBoard.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorBoard = action.payload;
    },
  },
});

export const { resetCreateNewBoard, resetNewBoardError } = boardsSlice.actions;

export default boardsSlice.reducer;
