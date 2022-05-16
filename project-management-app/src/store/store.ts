import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import boards from './boardsSlice';
import columns from './columnsSlice';
import tasks from './tasksSlice';

export const store = configureStore({
  reducer: {
    auth,
    boards,
    columns,
    tasks,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
