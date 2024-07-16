import { configureStore } from '@reduxjs/toolkit';
import { reducer as mainReducer } from 'features/Main/data';
import { reducer as commonReducer } from 'features/Common/data';
import { reducer as studentsReducer } from 'features/Students/data';

export function initializeStore(preloadedState = undefined) {
  return configureStore({
    reducer: {
      main: mainReducer,
      common: commonReducer,
      students: studentsReducer,
    },
    preloadedState,
  });
}

export const store = initializeStore();
