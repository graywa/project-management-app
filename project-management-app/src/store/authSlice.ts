import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteUser, fetchAuthLogin, fetchAuthRegistration, updateUser } from '../api/auth';

interface authState {
  isAuth: boolean;
  name: string;
  login: string;
  token: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: authState = {
  isAuth: !!localStorage.getItem('token'),
  isLoading: false,
  name: '',
  login: '',
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
  },
  extraReducers: {
    [fetchAuthRegistration.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = '';
      state.name = action.payload.name;
      state.error = 'Account created!';
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
      state.error = '';
      state.name = action.payload.name;
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
  },
});

export const { changeIsAuth } = authSlice.actions;

export default authSlice.reducer;
