import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface authState {
  isAuth: boolean;
  isSignUp: boolean;
  isLoading: boolean;
  name: string;
  token: string;
  errorMessage: string | null;
}

const initialState: authState = {
  isAuth: localStorage.getItem('isAuth') === 'true',
  isSignUp: false,
  isLoading: false,
  name: '',
  token: localStorage.getItem('token') || '',
  errorMessage: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeIsAuth(state, action: PayloadAction<boolean>) {
      localStorage.setItem('isAuth', action.payload.toString());
      state.isAuth = action.payload;
    },
    changeIsSignUp(state, action: PayloadAction<boolean>) {
      state.isSignUp = action.payload;
    },
    changeIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    changeName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    changeToken(state, action: PayloadAction<string>) {
      localStorage.setItem('token', action.payload);
      state.token = action.payload;
    },
    changeErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
  },
});

export default authSlice.reducer;
