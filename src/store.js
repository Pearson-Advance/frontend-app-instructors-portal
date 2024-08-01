import { configureStore } from '@reduxjs/toolkit';
import { reducer as mainReducer } from 'features/Main/data';
import { reducer as commonReducer } from 'features/Common/data';
import { reducer as studentsReducer } from 'features/Students/data';
import { reducer as classesReducer } from 'features/Classes/data';

export function initializeStore(preloadedState = undefined) {
  return configureStore({
    reducer: {
      main: mainReducer,
      common: commonReducer,
      students: studentsReducer,
      classes: classesReducer,
    },
    preloadedState,
  });
}

export const store = initializeStore();
