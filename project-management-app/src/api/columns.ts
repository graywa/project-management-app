import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { NoContent, URL_SERVER } from '../constants/queryVariables';
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
    if (e instanceof AxiosError && e.response?.data) {
      return thunkAPI.rejectWithValue(e.response?.data.error);
    }
    if (e instanceof Error) {
      return thunkAPI.rejectWithValue(e.message);
    }
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

const deleteColumn = createAsyncThunk(
  'columns/delete',
  async ({ boardId, columnId }: { boardId: string; columnId: string }, thunkAPI) => {
    try {
      const response = await axios({
        method: 'delete',
        url: `${URL_SERVER}/boards/${boardId}/columns/${columnId}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.status === NoContent) {
        return columnId;
      }
    } catch (e) {
      return thunkAPI.rejectWithValue('Error!');
    }
  }
);

export { getColumns, addColumns, deleteColumn };
