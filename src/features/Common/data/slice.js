/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

const initialState = {
  allClasses: {
    data: [],
    status: RequestStatus.INITIAL,
    error: null,
  },
  allCourses: {
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
    updateRequestAllCoursesStatus: (state, { payload }) => {
      state.allClasses.status = payload;
    },
    updateAllCourses: (state, { payload }) => {
      state.allCourses.data = payload;
      state.allCourses.status = RequestStatus.SUCCESS;
    },
  },
});

export const {
  updateRequestAllClassStatus,
  updateAllClasses,
  updateRequestAllCoursesStatus,
  updateAllCourses,
} = commonSlice.actions;

export const { reducer } = commonSlice;
