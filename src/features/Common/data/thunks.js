import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';

import {
  updateRequestAllClassStatus,
  updateAllClasses,
} from 'features/Common/data/slice';
import { getClassesByInstructor } from 'features/Common/data/api';

import { RequestStatus } from 'features/constants';

/* Fetch all classes by instructor username with optional filters whithout pagination.
 *
 * @param {string} username - The username of the instructor.
 * @param {Object} [options={}] - Optional parameters.
 * @param {boolean} [options.limit=false] - Determines if the pagination is required, true if need pagination
 *
 * @returns {Promise} - A promise that resolves to the response from the API.
 */

function fetchAllClassesData(userName, options = {}) {
  return async (dispatch) => {
    dispatch(updateRequestAllClassStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(
        await getClassesByInstructor(userName, options),
      );
      dispatch(updateAllClasses(response.data));
    } catch (error) {
      dispatch(updateRequestAllClassStatus(RequestStatus.ERROR));
      logError(error);
    }
  };
}

export {
  fetchAllClassesData,
};
