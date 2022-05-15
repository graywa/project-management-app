import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addTask, deleteTask, getTasks } from '../api/tasks';
import { ITask } from '../models/ITask';

interface taskState {
  columnId: string;
  isLoading: boolean;
  error: string | null;
  tasks: { [x: string]: ITask[] };
}

const initialState: taskState = {
  columnId: localStorage.getItem('columnId') || '',
  isLoading: false,
  error: null,
  tasks: {},
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    changeColumnId(state, action: PayloadAction<string>) {
      localStorage.setItem('columnId', action.payload);
      state.columnId = action.payload;
    },
  },
  extraReducers: {
    [getTasks.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = '';
      const { columnId, response }: { columnId: string; response: ITask[] } = action.payload;
      state.tasks[columnId] = response;
    },
    [getTasks.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [getTasks.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [addTask.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = '';
      const { columnId }: { columnId: string } = action.payload;
      state.tasks[columnId].push(action.payload);
    },
    [addTask.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [addTask.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteTask.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = '';
      const { columnId, taskId }: { columnId: string; taskId: string } = action.payload;
      state.tasks[columnId] = state.tasks[columnId].filter((el) => el.id !== taskId);
    },
    [deleteTask.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [deleteTask.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { changeColumnId } = tasksSlice.actions;

export default tasksSlice.reducer;
