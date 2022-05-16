import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from '../models/IUser';
import { URL_SERVER } from '../constants/queryVariables';
import jwtDecode from 'jwt-decode';
import { IJwt } from '../models/IJwt';

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
    const token = response.data.token;
    const { login } = jwtDecode<IJwt>(token);
    localStorage.setItem('token', token);
    localStorage.setItem('login', login || '');
    return { token, login };
  } catch (e) {
    return thunkAPI.rejectWithValue('Username or password is incorrect!');
  }
});

const updateUser = createAsyncThunk('auth/update', async (values: IUser, thunkAPI) => {
  const { name, login, password, id, token } = values;
  try {
    const response = await axios.put(
      `${URL_SERVER}/users/${id}`,
      { name, login, password },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    localStorage.setItem('login', response.data.login);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue('Error');
  }
});

const deleteUser = createAsyncThunk('auth/delete', async (values: IUser, thunkAPI) => {
  const { id, token } = values;
  try {
    const response = await axios.delete(`${URL_SERVER}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem('token', '');
    localStorage.setItem('login', '');
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue('Error');
  }
});

export { fetchAuthRegistration, fetchAuthLogin, updateUser, deleteUser };
