import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
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

const updateColumn = createAsyncThunk(
  'columns/update',
  async (
    {
      boardId,
      columnId,
      data,
    }: { boardId: string; columnId: string; data: { title: string; order: number } },
    thunkAPI
  ) => {
    try {
      const response = await axios({
        method: 'put',
        url: `${URL_SERVER}/boards/${boardId}/columns/${columnId}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data,
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

export { getColumns, addColumns, updateColumn, deleteColumn };
