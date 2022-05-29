import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { NoContent, UNAUTHORIZED, URL_SERVER } from '../constants/queryVariables';
import { IBoard } from '../models/IBoard';

export const createBoard = createAsyncThunk('boards/create', async (values: IBoard, thunkAPI) => {
  const { title, token } = values;
  try {
    const response = await axios.post(
      `${URL_SERVER}/boards`,
      { title, description: 'board' },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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

export const getBoards = createAsyncThunk('boards/getAll', async (token: string, thunkAPI) => {
  try {
    const response = await axios.get(`${URL_SERVER}/boards`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.data.statusCode === UNAUTHORIZED) {
      localStorage.setItem('isAuth', 'false');
      localStorage.setItem('token', '');
      console.log(e.response?.data.message);
      return thunkAPI.rejectWithValue(e.response?.data.message);
    }
    if (e instanceof Error) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
});

export const deleteBoard = createAsyncThunk('boards/delete', async (values: IBoard, thunkAPI) => {
  const { token, id } = values;
  try {
    const response = await axios.delete(`${URL_SERVER}/boards/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === NoContent) {
      return id;
    }
  } catch (e) {
    if (e instanceof AxiosError && e.response?.data) {
      return thunkAPI.rejectWithValue(e.response?.data.message);
    }
    if (e instanceof Error) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
});
