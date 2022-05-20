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
    {
      boardId,
      columnId,
      values,
    }: {
      boardId: string;
      columnId: string;
      values: { order: number; title: string; description: string; userId: string };
    },
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

const updateTask = createAsyncThunk(
  'tasks/update',
  async (
    {
      data,
      boardId,
      columnId,
      taskId,
    }: {
      data: {
        title: string;
        order: number;
        description: string;
        userId: string | undefined;
        boardId: string | undefined;
        columnId: string | undefined;
      };
      boardId: string | undefined;
      columnId: string | undefined;
      taskId: string | undefined;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios({
        method: 'put',
        url: `${URL_SERVER}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
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

const updTask = async (
  boardId: string,
  columnId: string,
  taskId: string,
  title: string,
  order: number,
  description: string,
  userId: string
) => {
  await axios({
    method: 'put',
    url: `${URL_SERVER}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    data: { title, order, description, userId, boardId, columnId },
  });
};

const changeTasksOrder = createAsyncThunk(
  'tasks/changeTasksOrder',
  async (
    {
      boardId,
      columnId,
      startIndex,
      endIndex,
      tasksOfColumn,
    }: {
      boardId: string;
      columnId: string;
      startIndex: number;
      endIndex: number;
      tasksOfColumn: ITask[];
    },
    thunkAPI
  ) => {
    try {
      const startTask = tasksOfColumn[startIndex];

      await updTask(
        boardId,
        columnId,
        startTask.id,
        startTask.title,
        1000,
        startTask.description,
        startTask.userId
      );

      if (startIndex < endIndex) {
        for (let i = startIndex + 1; i <= endIndex; i++) {
          const task = tasksOfColumn[i];
          await updTask(boardId, columnId, task.id, task.title, i, task.description, task.userId);
        }
      }

      if (startIndex > endIndex) {
        for (let i = startIndex - 1; i >= endIndex; i--) {
          const task = tasksOfColumn[i];
          await updTask(
            boardId,
            columnId,
            task.id,
            task.title,
            i + 2,
            task.description,
            task.userId
          );
        }
      }

      await updTask(
        boardId,
        columnId,
        startTask.id,
        startTask.title,
        endIndex + 1,
        startTask.description,
        startTask.userId
      );

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

export { getTasks, addTask, updateTask, deleteTask, changeTasksOrder };
