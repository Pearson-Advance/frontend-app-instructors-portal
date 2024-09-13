import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  updateInstructorInfo,
  updateInstructorInfoStatus,
  updateEvents,
  updateEventsRequestStatus,
} from 'features/Instructor/data/slice';
import {
  getInstructorByEmail,
  getEventsByInstructor,
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

function fetchEventsData(eventData) {
  return async (dispatch) => {
    dispatch(updateEventsRequestStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(await getEventsByInstructor(eventData));
      dispatch(updateEvents(response.data.results));
      dispatch(updateEventsRequestStatus(RequestStatus.SUCCESS));
    } catch (error) {
      logError(error);
      dispatch(updateEventsRequestStatus(RequestStatus.ERROR));
    }
  };
}

export {
  fetchInstructorProfile,
  fetchEventsData,
};
