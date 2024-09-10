/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { startOfMonth, endOfMonth } from 'date-fns';
import { RequestStatus } from 'features/constants';

const initialState = {
  info: {
    status: RequestStatus.INITIAL,
  },
  events: {
    data: [],
    status: RequestStatus.INITIAL,
    dates: {
      start_date: startOfMonth(new Date()).toISOString(),
      end_date: endOfMonth(new Date()).toISOString(),
    },
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
    updateEventsRequestStatus: (state, { payload }) => {
      state.events.status = payload;
    },
    updateEvents: (state, { payload }) => {
      state.events.data = payload;
    },
    updateDatesCalendar: (state, { payload }) => {
      state.events.date = payload;
    },
  },
});

export const {
  updateInstructorInfo,
  resetInstructorInfo,
  updateInstructorInfoStatus,
  updateEventsRequestStatus,
  updateEvents,
  updateDatesCalendar,
} = instructorSlice.actions;

export const { reducer } = instructorSlice;
