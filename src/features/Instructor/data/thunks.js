import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  updateInstructorInfo,
  updateInstructorInfoStatus,
} from 'features/Instructor/data/slice';
import {
  getInstructorByEmail,
} from 'features/Instructor/data/api';

import { RequestStatus } from 'features/constants';

function fetchInstructorProfile(email, options = {}) {
  return async (dispatch) => {
    dispatch(updateInstructorInfoStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(await getInstructorByEmail(email, options));
      const instructorInfo = {
        ...response?.data[0] || {},
      };

      dispatch(updateInstructorInfo(instructorInfo));
      dispatch(updateInstructorInfoStatus(RequestStatus.SUCCESS));
    } catch (error) {
      logError(error);
      dispatch(updateInstructorInfoStatus(RequestStatus.ERROR));
    }
  };
}

export {
  fetchInstructorProfile,
};
