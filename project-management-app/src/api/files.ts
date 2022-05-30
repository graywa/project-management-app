import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { UNAUTHORIZED, URL_SERVER } from '../constants/queryVariables';

const fileUpload = createAsyncThunk(
  'file/uploadFile',
  async ({ taskId, file }: { taskId: string; file: unknown }, thunkAPI) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${URL_SERVER}/file`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
        data: {
          taskId,
          file,
        },
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
  }
);

const fileDownload = createAsyncThunk(
  'file/downloadFile',
  async ({ taskId, fileName }: { taskId: string; fileName: string }, thunkAPI) => {
    try {
      const response = await axios({
        method: 'get',
        url: `${URL_SERVER}/file/${taskId}/${fileName}`,
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response) {
        const urlImage = window.URL.createObjectURL(new Blob([response.data]));
        return { urlImage, taskId };
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

export { fileUpload, fileDownload };
