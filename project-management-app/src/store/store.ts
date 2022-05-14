import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import boards from './boardsSlice';
import columns from './columnsSlice';

export const store = configureStore({
  reducer: {
    auth,
    boards,
    columns,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
