import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteUser, fetchAuthLogin, fetchAuthRegistration, updateUser } from '../api/auth';
import { getBoards } from '../api/boards';
import { getColumns } from '../api/columns';

interface authState {
  isAuth: boolean;
  name: string;
  login: string;
  token: string;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: authState = {
  isAuth: localStorage.getItem('isAuth') === 'true',
  isLoading: false,
  isSuccess: false,
  name: '',
  login: localStorage.getItem('login') || '',
  token: localStorage.getItem('token') || '',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeIsAuth(state, action: PayloadAction<boolean>) {
      localStorage.setItem('isAuth', action.payload.toString());
      state.isAuth = action.payload;
    },
    resetSuccess(state) {
      state.isSuccess = false;
    },
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: {
    [fetchAuthRegistration.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.error = '';
      state.name = action.payload.name;
    },
    [fetchAuthRegistration.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [fetchAuthRegistration.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [fetchAuthLogin.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = '';
      state.token = action.payload.token;
      state.login = action.payload.login;
      state.isAuth = true;
    },
    [fetchAuthLogin.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [fetchAuthLogin.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [updateUser.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.error = '';
      state.name = action.payload.name;
      state.login = action.payload.login;
    },
    [updateUser.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [updateUser.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteUser.fulfilled.type]: (state) => {
      state.isLoading = false;
      state.error = '';
      state.isAuth = false;
      state.name = '';
      state.token = '';
    },
    [deleteUser.pending.type]: (state) => {
      state.error = '';
      state.isLoading = true;
    },
    [deleteUser.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [getBoards.rejected.type]: (state, action: PayloadAction<string>) => {
      if (action.payload === 'Unauthorized') {
        state.isAuth = false;
      }
    },
    [getColumns.rejected.type]: (state, action: PayloadAction<string>) => {
      if (action.payload === 'Unauthorized') {
        state.isAuth = false;
      }
    },
  },
});

export const { changeIsAuth, resetSuccess, resetError } = authSlice.actions;

export default authSlice.reducer;
