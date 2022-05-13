import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchAuthLogin, fetchAuthRegistration } from '../api/auth';

interface authState {
  isAuth: boolean;
  name: string;
  token: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: authState = {
  isAuth: localStorage.getItem('isAuth') === 'true',
  isLoading: false,
  name: '',
  token: localStorage.getItem('token') || '',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
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
      console.log(action.payload);

      localStorage.setItem('token', action.payload.token);
      state.token = action.payload.token;
      localStorage.setItem('isAuth', 'true');
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
  },
});

export default authSlice.reducer;
