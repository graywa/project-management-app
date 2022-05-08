import { createSlice } from '@reduxjs/toolkit';

interface authState {
  isAuth: boolean;
  name: string;
  token: string;
}

const initialState: authState = {
  isAuth: false,
  name: '',
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
});

export const {} = authSlice.actions;

export default authSlice.reducer;
