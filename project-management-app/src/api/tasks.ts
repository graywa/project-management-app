import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { NoContent, URL_SERVER } from '../constants/queryVariables';
import { ITask } from '../models/ITask';

const getTasks = createAsyncThunk(
  'tasks/getAll',
  async ({ boardId, columnId }: { boardId: string; columnId: string }, thunkAPI) => {
    try {
      const response = await axios({
        method: 'get',
        url: `${URL_SERVER}/boards/${boardId}/columns/${columnId}/tasks`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      return { response: response.data, columnId };
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

const addTask = createAsyncThunk(
  'tasks/add',
  async (
    { boardId, columnId, values }: { boardId: string; columnId: string; values: ITask },
    thunkAPI
  ) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${URL_SERVER}/boards/${boardId}/columns/${columnId}/tasks`,
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

const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (
    {
      boardId,
      columnId,
      taskId,
    }: { boardId: string | undefined; columnId: string | undefined; taskId: string | undefined },
    thunkAPI
  ) => {
    try {
      const response = await axios({
        method: 'delete',
        url: `${URL_SERVER}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.status === NoContent) {
        return { columnId, taskId };
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

export { getTasks, addTask, deleteTask };
