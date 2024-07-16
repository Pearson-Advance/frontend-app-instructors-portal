/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

const initialState = {
  allClasses: {
    data: [],
    status: RequestStatus.INITIAL,
    error: null,
  },
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    fetchAllClassesDataRequest: (state) => {
      state.allClasses.status = RequestStatus.LOADING;
    },
    fetchAllClassesDataSuccess: (state, { payload }) => {
      state.allClasses.data = payload;
      state.allClasses.count = payload?.length;
      state.allClasses.status = RequestStatus.SUCCESS;
    },
    fetchAllClassesDataFailed: (state) => {
      state.allClasses.status = RequestStatus.ERROR;
    },
  },
});

export const {
  fetchAllClassesDataRequest,
  fetchAllClassesDataSuccess,
  fetchAllClassesDataFailed,
} = commonSlice.actions;

export const { reducer } = commonSlice;
