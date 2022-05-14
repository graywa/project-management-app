import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createBoard } from '../api/boards';

interface IBoard {
  id: string;
  title: string;
}

interface boardsState {
  boards: IBoard[];
  isLoading: boolean;
  error: string;
}

const initialState: boardsState = {
  boards: [],
  isLoading: false,
  error: '',
};

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
  extraReducers: {
    [createBoard.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = '';
      state.boards.push(action.payload);
    },
    [createBoard.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [createBoard.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default boardsSlice.reducer;
