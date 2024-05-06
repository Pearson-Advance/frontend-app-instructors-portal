import { configureStore } from '@reduxjs/toolkit';
import { reducer as mainReducer } from 'features/Main/data';

export function initializeStore(preloadedState = undefined) {
  return configureStore({
    reducer: {
      main: mainReducer,
    },
    preloadedState,
  });
}

export const store = initializeStore();
