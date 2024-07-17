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
    updateRequestAllClassStatus: (state, { payload }) => {
      state.allClasses.status = payload;
    },
    updateAllClasses: (state, { payload }) => {
      state.allClasses.data = payload;
      state.allClasses.status = RequestStatus.SUCCESS;
    },
  },
});

export const {
  updateRequestAllClassStatus,
  updateAllClasses,
} = commonSlice.actions;

export const { reducer } = commonSlice;
