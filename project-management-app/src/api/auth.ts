import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { IUser } from '../models/IUser';
import { CREATED, URL_SERVER } from '../constants/queryVariables';
import jwtDecode from 'jwt-decode';
import { IJwt } from '../models/IJwt';
import { FormikState } from 'formik';

const fetchAuthRegistration = createAsyncThunk(
  'auth/signup',
  async (
    {
      values,
      resetForm,
    }: {
      values: IUser;
      resetForm: (
        nextState?:
          | Partial<
              FormikState<{
                name: string;
                login: string;
                password: string;
                confirmPassword: string;
              }>
            >
          | undefined
      ) => void;
    },
    thunkAPI
  ) => {
    const { name, login, password } = values;
    try {
      const response = await axios({
        method: 'post',
        url: `${URL_SERVER}/signup`,
        data: { name, login, password },
      });
      if (response.status === CREATED) {
        resetForm();
      }
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError && e.response?.data) {
        return thunkAPI.rejectWithValue(e.response?.data.message);
      }
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

const fetchAuthLogin = createAsyncThunk(
  'auth/signin',
  async (
    {
      values,
      resetForm,
    }: {
      values: IUser;
      resetForm: (
        nextState?:
          | Partial<
              FormikState<{
                name: string;
                login: string;
                password: string;
                confirmPassword: string;
              }>
            >
          | undefined
      ) => void;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${URL_SERVER}/signin`,
        data: values,
      });
      if (response.status === CREATED) {
        resetForm();
      }
      const token = response.data.token;
      const { login } = jwtDecode<IJwt>(token);
      localStorage.setItem('token', token);
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('login', login || '');
      return { token, login };
    } catch (e) {
      if (e instanceof AxiosError && e.response?.data) {
        return thunkAPI.rejectWithValue(e.response?.data.message);
      }
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

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
    if (e instanceof AxiosError && e.response?.data) {
      return thunkAPI.rejectWithValue(e.response?.data.message);
    }
    if (e instanceof Error) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
});

const deleteUser = createAsyncThunk('auth/delete', async (values: IUser, thunkAPI) => {
  const { id, token } = values;
  try {
    const response = await axios.delete(`${URL_SERVER}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem('isAuth', 'false');
    localStorage.setItem('token', '');
    localStorage.setItem('login', '');
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.data) {
      return thunkAPI.rejectWithValue(e.response?.data.message);
    }
    if (e instanceof Error) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
});

export { fetchAuthRegistration, fetchAuthLogin, updateUser, deleteUser };
