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
    console.log(response);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue('Error');
  }
});
