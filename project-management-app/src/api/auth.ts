import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from '../models/IUser';
import { URL_SERVER } from '../constants/queryVariables';

const fetchAuthRegistration = createAsyncThunk('auth/signup', async (values: IUser, thunkAPI) => {
  const { name, login, password } = values;
  try {
    const response = await axios({
      method: 'post',
      url: `${URL_SERVER}/signup`,
      data: { name, login, password },
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue('User login already exists!');
  }
});

const fetchAuthLogin = createAsyncThunk('auth/signin', async (values: IUser, thunkAPI) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${URL_SERVER}/signin`,
      data: values,
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue('Username or password is incorrect!');
  }
});

export { fetchAuthRegistration, fetchAuthLogin };
