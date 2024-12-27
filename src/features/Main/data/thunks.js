import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';
import { getInstitutionName } from 'features/Main/data/api';
import {
  updateSelectedInstitutions,
  updateRequestClassStatus,
  updateClasses,
  updateClassError,
} from 'features/Main/data/slice';
import { getClassesByInstructor } from 'features/Common/data/api';
import { RequestStatus } from 'features/constants';

function fetchInstitutionData() {
  return async (dispatch) => {
    dispatch(updateSelectedInstitutions({ status: RequestStatus.LOADING }));
    try {
      const { data } = camelCaseObject(await getInstitutionName());
      const sortedData = sortAlphabetically(data, 'name');
      dispatch(updateSelectedInstitutions({ status: RequestStatus.SUCCESS, data: sortedData }));
    } catch (error) {
      dispatch(updateSelectedInstitutions({ status: RequestStatus.ERROR, error }));
      logError(error);
    }
  };
}

/* Fetch all classes by instructor username to allow authorization in portal
 *
 * @param {string} username - The username of the instructor.
 *
 * @returns {Promise} - A promise that resolves to the response from the API.
 */
function fetchClassAuthorization(username) {
  return async (dispatch) => {
    dispatch(updateRequestClassStatus(RequestStatus.LOADING));

    try {
      const params = {
        limit: false,
      };
      const response = camelCaseObject(
        await getClassesByInstructor(username, params),
      );
      dispatch(updateClasses(response.data));
      dispatch(updateRequestClassStatus(RequestStatus.SUCCESS));
    } catch (error) {
      dispatch(updateRequestClassStatus(RequestStatus.ERROR));
      dispatch(updateClassError(error?.customAttributes?.httpErrorStatus));
      logError(error);
    }
  };
}

export {
  fetchInstitutionData,
  fetchClassAuthorization,
};
