/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

const initialState = {
  info: {
    status: RequestStatus.INITIAL,
  },
};

export const instructorSlice = createSlice({
  name: 'instructor',
  initialState,
  reducers: {
    updateInstructorInfo: (state, { payload }) => {
      state.info = payload;
    },
    resetInstructorInfo: (state) => {
      state.info = initialState.instructorInfo;
    },
    updateInstructorInfoStatus: (state, { payload }) => {
      state.info.status = payload;
    },
  },
});

export const {
  updateInstructorInfo,
  resetInstructorInfo,
  updateInstructorInfoStatus,
} = instructorSlice.actions;

export const { reducer } = instructorSlice;
