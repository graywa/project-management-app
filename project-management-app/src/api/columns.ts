import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { IUser } from '../models/IUser';
import { URL_SERVER } from '../constants/queryVariables';

const getColumns = createAsyncThunk('columns/getAll', async (values, thunkAPI) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${URL_SERVER}/boards/${1}/columns`,
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue('Columns not found!');
  }
});

export { getColumns };
