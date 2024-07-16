import { configureStore } from '@reduxjs/toolkit';
import { reducer as mainReducer } from 'features/Main/data';
import { reducer as commonReducer } from 'features/Common/data';

export function initializeStore(preloadedState = undefined) {
  return configureStore({
    reducer: {
      main: mainReducer,
      common: commonReducer,
    },
    preloadedState,
  });
}

export const store = initializeStore();
