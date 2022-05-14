import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import columns from './columnSlice';

export const store = configureStore({
  reducer: {
    auth,
    columns,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
