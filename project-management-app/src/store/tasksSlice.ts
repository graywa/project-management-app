import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fileDownload, fileUpload } from '../api/files';
import {
  addTask,
  changeTasksOrderOneColumn,
  changeTasksOrderTwoColumns,
  deleteTask,
  getTasks,
  updateTask,
} from '../api/tasks';
import { ITask } from '../models/ITask';

interface taskState {
  columnId: string;
  isLoading: boolean;
  isCreateTask: boolean;
  isUpdateTask: boolean;
  errorTask: string | null;
  tasks: { [x: string]: ITask[] };
  successUpload: boolean;
  urlImages: { taskId: string; urlImage: string }[];
}

const initialState: taskState = {
  columnId: localStorage.getItem('columnId') || '',
  isLoading: false,
  isCreateTask: false,
  isUpdateTask: false,
  errorTask: null,
  tasks: {},
  successUpload: false,
  urlImages: [],
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
    resetUpdateTask(state) {
      state.isUpdateTask = false;
    },
  },
  extraReducers: {
    [getTasks.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorTask = '';
      const { columnId, response }: { columnId: string; response: ITask[] } = action.payload;
      state.tasks[columnId] = response?.sort((a: ITask, b: ITask) => a.order - b.order);
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
    [updateTask.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorTask = '';
      state.isUpdateTask = true;

      const { columnId, id: taskId }: { columnId: string; id: string } = action.payload;
      state.tasks[columnId][state.tasks[columnId].findIndex((el) => el.id === taskId)] =
        action.payload;
    },
    [updateTask.pending.type]: (state) => {
      state.errorTask = '';
      state.isLoading = true;
    },
    [updateTask.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorTask = action.payload;
    },
    [deleteTask.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorTask = '';
      const {
        columnId,
        taskId,
        newTasks,
      }: { columnId: string; taskId: string; newTasks: ITask[] } = action.payload;
      state.tasks[columnId] = state.tasks[columnId].filter((el) => el.id !== taskId);
      state.tasks[columnId] = newTasks?.sort((a: ITask, b: ITask) => a.order - b.order);
    },
    [deleteTask.pending.type]: (state) => {
      state.errorTask = '';
      state.isLoading = true;
    },
    [deleteTask.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorTask = action.payload;
    },
    [changeTasksOrderOneColumn.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorTask = '';

      const { columnId, response }: { columnId: string; response: ITask[] } = action.payload;
      state.tasks[columnId] = response.sort((a: ITask, b: ITask) => a.order - b.order);
    },
    [changeTasksOrderOneColumn.pending.type]: (state) => {
      state.errorTask = '';
      state.isLoading = true;
    },
    [changeTasksOrderOneColumn.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorTask = action.payload;
    },
    [changeTasksOrderTwoColumns.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorTask = '';

      const {
        responseSourceColumn,
        sourceColumnId,
        responseDestinationColumn,
        destinationColumnId,
      } = action.payload;
      state.tasks[sourceColumnId] = responseSourceColumn?.sort(
        (a: ITask, b: ITask) => a.order - b.order
      );
      state.tasks[destinationColumnId] = responseDestinationColumn?.sort(
        (a: ITask, b: ITask) => a.order - b.order
      );
    },
    [changeTasksOrderTwoColumns.pending.type]: (state) => {
      state.errorTask = '';
      state.isLoading = true;
    },
    [changeTasksOrderTwoColumns.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorTask = action.payload;
    },
    [fileUpload.fulfilled.type]: (state) => {
      state.isLoading = false;
      state.errorTask = '';
      state.successUpload = !state.successUpload;
    },
    [fileUpload.pending.type]: (state) => {
      state.errorTask = '';
      state.isLoading = true;
    },
    [fileUpload.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorTask = action.payload;
    },
    [fileDownload.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.errorTask = '';
      const { taskId, urlImage } = action.payload;
      state.urlImages.push({ taskId, urlImage });
    },
    [fileDownload.pending.type]: (state) => {
      state.errorTask = '';
      state.isLoading = true;
    },
    [fileDownload.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorTask = action.payload;
    },
  },
});

export const { changeColumnId, resetCreateNewTask, resetUpdateTask, setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
