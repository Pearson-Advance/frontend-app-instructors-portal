import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  fetchAllClassesDataRequest,
  fetchAllClassesDataSuccess,
  fetchAllClassesDataFailed,
} from 'features/Common/data/slice';

import { getClassesByInstructor } from 'features/Common/data/api';
import { initialPage } from 'features/constants';

function fetchAllClassesData(instructorUsername, limit = false, urlParamsFilters = '') {
  return async (dispatch) => {
    dispatch(fetchAllClassesDataRequest());

    try {
      const response = camelCaseObject(
        await getClassesByInstructor(instructorUsername, limit, initialPage, urlParamsFilters),
      );
      dispatch(fetchAllClassesDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchAllClassesDataFailed());
      logError(error);
    }
  };
}

export {
  fetchAllClassesData,
};
