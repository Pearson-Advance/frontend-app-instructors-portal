/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from 'features/constants';

const initialState = {
  table: {
    currentPage: 1,
    data: [],
    status: RequestStatus.INITIAL,
    error: null,
    numPages: 0,
    count: 0,
  },
};

export const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    resetClassesTable: (state) => {
      state.table = initialState.table;
    },
    updateCurrentPage: (state, { payload }) => {
      state.table.currentPage = payload;
    },
    updateClassesRequestStatus: (state, { payload }) => {
      state.table.status = payload;
    },
    updateClassesTable: (state, { payload }) => {
      const { results, count, numPages } = payload;
      state.table.status = RequestStatus.SUCCESS;
      state.table.data = results;
      state.table.numPages = numPages;
      state.table.count = count;
    },
  },
});

export const {
  updateCurrentPage,
  updateClassesRequestStatus,
  updateClassesTable,
  resetClassesTable,
} = classesSlice.actions;

export const { reducer } = classesSlice;
