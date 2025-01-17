import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

import {
  updateClassesTable,
  updateClassesRequestStatus,
} from 'features/Classes/data/slice';
import { getClassesByInstructor } from 'features/Common/data/api';

import { RequestStatus } from 'features/constants';

function getClasses(userName, options = {}) {
  return async (dispatch) => {
    dispatch(updateClassesRequestStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(await getClassesByInstructor(userName, options));
      const sortedData = sortAlphabetically(response.data.results, 'className');
      const classes = {
        ...response.data,
        results: sortedData,
      };

      dispatch(updateClassesTable(classes));
    } catch (error) {
      dispatch(updateClassesRequestStatus(RequestStatus.ERROR));
      logError(error);
    }
  };
}

export {
  getClasses,
};
