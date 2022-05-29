import { IColumn } from './../models/IColumn';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { NoContent, UNAUTHORIZED, URL_SERVER } from '../constants/queryVariables';

const updColumn = async (boardId: string, columnId: string, title: string, order: number) => {
  await axios({
    method: 'put',
    url: `${URL_SERVER}/boards/${boardId}/columns/${columnId}`,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    data: { title, order },
  });
};

const getColumns = createAsyncThunk('columns/getAll', async (boardId: string, thunkAPI) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${URL_SERVER}/boards/${boardId}/columns`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    return response.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.data.statusCode === UNAUTHORIZED) {
      localStorage.setItem('isAuth', 'false');
      localStorage.setItem('token', '');
      return thunkAPI.rejectWithValue(e.response?.data.message);
    }
    if (e instanceof Error) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
});

const addColumns = createAsyncThunk(
  'columns/add',
  async (
    { boardId, values }: { boardId: string; values: { title: string; order: number } },
    thunkAPI
  ) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${URL_SERVER}/boards/${boardId}/columns`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: values,
      });
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
      if (e instanceof AxiosError && e.response?.data) {
        return thunkAPI.rejectWithValue(e.response?.data.message);
      }
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

const deleteColumn = createAsyncThunk(
  'columns/delete',
  async (
    { boardId, columnId, columns }: { boardId: string; columnId: string; columns: IColumn[] },
    thunkAPI
  ) => {
    try {
      const response = await axios({
        method: 'delete',
        url: `${URL_SERVER}/boards/${boardId}/columns/${columnId}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const deleteColumnIndex = columns.findIndex((el) => el.id === columnId);

      for (let i = deleteColumnIndex + 1; i < columns.length; i++) {
        const column = columns[i];
        await updColumn(boardId, column.id, column.title, i);
      }

      getColumns(boardId);

      if (response.status === NoContent) {
        return columnId;
      }
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

const changeColumnsOrder = createAsyncThunk(
  'columns/changeColumnsOrder',
  async (
    {
      boardId,
      startIndex,
      endIndex,
      columns,
    }: { boardId: string; startIndex: number; endIndex: number; columns: IColumn[] },
    thunkAPI
  ) => {
    try {
      const startItem = columns[startIndex];

      await updColumn(boardId, startItem.id, startItem.title, 1000);

      if (startIndex < endIndex) {
        for (let i = startIndex + 1; i <= endIndex; i++) {
          const column = columns[i];
          await updColumn(boardId, column.id, column.title, i);
        }
      }

      if (startIndex > endIndex) {
        for (let i = startIndex - 1; i >= endIndex; i--) {
          const column = columns[i];
          await updColumn(boardId, column.id, column.title, i + 2);
        }
      }

      await updColumn(boardId, startItem.id, startItem.title, endIndex + 1);

      const response = await axios({
        method: 'get',
        url: `${URL_SERVER}/boards/${boardId}/columns`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

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

export { getColumns, addColumns, updateColumn, deleteColumn, changeColumnsOrder };
