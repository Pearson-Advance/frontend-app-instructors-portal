/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { initialStateService } from 'features/constants';

const initialState = {
  activeTab: 'dashboard',
  institution: {},
  institutions: {
    ...initialStateService,
  },
  username: '',
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
  },
});

export const {
  updateSelectedInstitution,
  updateSelectedInstitutions,
  updateActiveTab,
  updateUsername,
} = mainSlice.actions;

export const { reducer } = mainSlice;
