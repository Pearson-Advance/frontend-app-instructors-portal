import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

import {
  updateRequestAllClassStatus,
  updateAllClasses,
  updateAllCourses,
  updateRequestAllCoursesStatus,
} from 'features/Common/data/slice';
import { getClassesByInstructor, getCoursesByInstructor } from 'features/Common/data/api';
import { isOfferingsFlagEnabled, withMockSessionNames } from 'features/Common/data/mocks';

import { RequestStatus } from 'features/constants';

/* Fetch all classes by instructor username with optional filters without pagination.
 *
 * @param {string} username - The username of the instructor.
 * @param {Object} [options={}] - Optional parameters.
 * @param {boolean} [options.limit=false] - Determines if the pagination is required, true if need pagination
 *
 * @returns {Promise} - A promise that resolves to the response from the API.
 */

function fetchAllClassesData(userName, options = {}) {
  return async (dispatch, getState) => {
    dispatch(updateRequestAllClassStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(
        await getClassesByInstructor(userName, options),
      );
      const sortedData = sortAlphabetically(response.data, 'className');

      const institution = getState()?.main?.institution;
      const isSessionsEnabled = isOfferingsFlagEnabled() && Boolean(institution?.hasOfferings);
      const allClasses = isSessionsEnabled ? withMockSessionNames(sortedData) : sortedData;

      dispatch(updateAllClasses(allClasses));
      dispatch(updateRequestAllClassStatus(RequestStatus.SUCCESS));
    } catch (error) {
      dispatch(updateRequestAllClassStatus(RequestStatus.ERROR));
      logError(error);
    }
  };
}

/*
 * Fetch all courses by instructor username with optional filters without pagination.
 *
 * @param {string} username - The username of the instructor.
 * @param {Object} [options={}] - Optional parameters.
 * @param {boolean} [options.limit=false] - Determines if the pagination is required, true if need pagination
 *
 * @returns {Promise} - A promise that resolves to the response from the API.
 */
function fetchAllCourses(userName, options = {}) {
  return async (dispatch) => {
    dispatch(updateRequestAllCoursesStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(
        await getCoursesByInstructor(userName, options),
      );
      dispatch(updateAllCourses(response.data));
      dispatch(updateRequestAllCoursesStatus(RequestStatus.SUCCESS));
    } catch (error) {
      dispatch(updateRequestAllCoursesStatus(RequestStatus.ERROR));
      logError(error);
    }
  };
}

export {
  fetchAllClassesData,
  fetchAllCourses,
};
