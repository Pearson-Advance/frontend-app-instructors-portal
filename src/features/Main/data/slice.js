/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { initialStateService, RequestStatus } from 'features/constants';

const initialState = {
  activeTab: 'dashboard',
  institution: {},
  institutions: {
    ...initialStateService,
  },
  username: '',
  classes: {
    data: [],
    status: RequestStatus.INITIAL,
    error: null,
  },
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    updateSelectedInstitution: (state, { payload }) => {
      state.institution = payload.data;
    },
    updateSelectedInstitutions: (state, { payload }) => {
      state.institutions.status = payload.status;
      state.institutions.data = payload.data;
    },
    updateActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
    updateUsername: (state, { payload }) => {
      state.username = payload;
    },
    updateRequestClassStatus: (state, { payload }) => {
      state.classes.status = payload;
    },
    updateClasses: (state, { payload }) => {
      state.classes.data = payload;
      state.classes.status = RequestStatus.SUCCESS;
    },
    updateClassError: (state, { payload }) => {
      state.classes.error = payload;
    },
  },
});

export const {
  updateSelectedInstitution,
  updateSelectedInstitutions,
  updateActiveTab,
  updateUsername,
  updateRequestClassStatus,
  updateClasses,
  updateClassError,
} = mainSlice.actions;

export const { reducer } = mainSlice;
