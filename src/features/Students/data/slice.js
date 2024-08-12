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
  filters: {},
  student: {
    status: RequestStatus.INITIAL,
  },
};

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    resetStudentsTable: (state) => {
      state.table = initialState.table;
    },
    updateCurrentPage: (state, { payload }) => {
      state.table.currentPage = payload;
    },
    updateStudentsRequestStatus: (state, { payload }) => {
      state.table.status = payload;
    },
    updateStudentProfileRequestStatus: (state, { payload }) => {
      state.student.status = payload;
    },
    updateStudentsTable: (state, { payload }) => {
      const { results, count, numPages } = payload;
      state.table.status = RequestStatus.SUCCESS;
      state.table.data = results;
      state.table.numPages = numPages;
      state.table.count = count;
    },
    updateFilters: (state, { payload }) => {
      state.filters = payload;
    },
    updateStudent: (state, { payload }) => {
      state.student = payload;
    },
    resetStudent: (state) => {
      state.student = initialState.student;
    },
  },
});

export const {
  updateStudent,
  resetStudent,
  updateCurrentPage,
  updateStudentProfileRequestStatus,
  updateStudentsRequestStatus,
  updateStudentsTable,
  resetStudentsTable,
  updateFilters,
} = studentsSlice.actions;

export const { reducer } = studentsSlice;
