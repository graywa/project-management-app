import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL_SERVER } from '../constants/queryVariables';

interface IValues {
  title: string;
  token: string;
}

export const createBoard = createAsyncThunk('boards/create', async (values: IValues, thunkAPI) => {
  const { title, token } = values;
  try {
    const response = await axios.post(
      `${URL_SERVER}/boards`,
      { title },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue('Error');
  }
});

export const getBoards = createAsyncThunk('boards/get', async (token: string, thunkAPI) => {
  try {
    const response = await axios.get(`${URL_SERVER}/boards`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue('Error');
  }
});

interface IDelValues {
  token: string;
  id: string;
}

export const deleteBoard = createAsyncThunk(
  'boards/delete',
  async (values: IDelValues, thunkAPI) => {
    const { token, id } = values;
    try {
      const response = await axios.delete(`${URL_SERVER}/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 204) {
        return id;
      }
    } catch (e) {
      return thunkAPI.rejectWithValue('Error');
    }
  }
);
