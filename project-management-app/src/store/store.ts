import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import boards from './boardsSlice';

export const store = configureStore({
  reducer: {
    auth,
    boards,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
