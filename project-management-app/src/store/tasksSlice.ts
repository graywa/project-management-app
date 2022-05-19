import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addTask, deleteTask, getTasks } from '../api/tasks';
import { ITask } from '../models/ITask';

interface taskState {
  columnId: string;
  isLoading: boolean;
  isCreateTask: boolean;
  errorTask: string | null;
  tasks: { [x: string]: ITask[] };
}

const initialState: taskState = {
  columnId: localStorage.getItem('columnId') || '',
  isLoading: false,
  isCreateTask: false,
  errorTask: null,
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
    setTasks(state, action) {
      const columnId = action.payload.columnId;
      state.tasks[columnId] = action.payload.newTasks;
    },
    resetCreateNewTask(state) {
      state.isCreateTask = false;
    },
  },
  extraReducers: {
    [getTasks.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorTask = '';
      const { columnId, response }: { columnId: string; response: ITask[] } = action.payload;
      state.tasks[columnId] = response;
    },
    [getTasks.pending.type]: (state) => {
      state.errorTask = '';
      state.isLoading = true;
    },
    [getTasks.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorTask = action.payload;
    },
    [addTask.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.isCreateTask = true;
      state.errorTask = '';
      const { columnId }: { columnId: string } = action.payload;
      state.tasks[columnId].push(action.payload);
    },
    [addTask.pending.type]: (state) => {
      state.errorTask = '';
      state.isLoading = true;
    },
    [addTask.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorTask = action.payload;
    },
    [deleteTask.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorTask = '';
      const { columnId, taskId }: { columnId: string; taskId: string } = action.payload;
      state.tasks[columnId] = state.tasks[columnId].filter((el) => el.id !== taskId);
    },
    [deleteTask.pending.type]: (state) => {
      state.errorTask = '';
      state.isLoading = true;
    },
    [deleteTask.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorTask = action.payload;
    },
  },
});

export const { changeColumnId, resetCreateNewTask, setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
