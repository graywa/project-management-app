import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL_SERVER } from '../constants/queryVariables';
import { IColumn } from '../models/IColumn';

const getColumns = createAsyncThunk('columns/getAll', async (boardId: string, thunkAPI) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${URL_SERVER}/boards/${boardId}/columns`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue('Columns not found!');
  }
});

const addColumns = createAsyncThunk(
  'columns/add',
  async ({ boardId, values }: { boardId: string; values: IColumn }, thunkAPI) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${URL_SERVER}/boards/${boardId}/columns`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: values,
      });
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue('Error!');
    }
  }
);

export { getColumns, addColumns };
