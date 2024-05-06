/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { initialStateService } from 'features/constants';

const initialState = {
  institution: {},
  institutions: {
    ...initialStateService,
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
  },
});

export const {
  updateSelectedInstitution,
  updateSelectedInstitutions,
} = mainSlice.actions;

export const { reducer } = mainSlice;
