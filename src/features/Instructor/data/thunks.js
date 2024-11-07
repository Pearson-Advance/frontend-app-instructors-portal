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

function fetchEventsData(eventData, currentEvents = []) {
  return async (dispatch) => {
    dispatch(updateEventsRequestStatus(RequestStatus.LOADING));

    let allEvents = currentEvents;
    let page = 1;

    const fetchAllPages = async () => {
      try {
        const response = camelCaseObject(await getEventsByInstructor({ ...eventData, page }));
        const { results, next: existNextPage } = response.data;

        const uniqueResults = results
          .filter(newEvent => !allEvents.some(existingEvent => existingEvent.id === newEvent.id
              && existingEvent.start === newEvent.start
              && existingEvent.end === newEvent.end))
          .map(newEvent => ({
            ...newEvent,
            elementId: `${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
          }));

        allEvents = [...allEvents, ...uniqueResults];
        dispatch(updateEvents(allEvents));

        if (existNextPage) {
          page += 1;
          // eslint-disable-next-line no-promise-executor-return
          await new Promise((resolve) => setTimeout(resolve, 200));
          return fetchAllPages();
        }

        dispatch(updateEventsRequestStatus(RequestStatus.SUCCESS));
        return allEvents;
      } catch (error) {
        dispatch(updateEventsRequestStatus(RequestStatus.ERROR));
        return logError(error);
      }
    };

    return fetchAllPages();
  };
}

export {
  fetchInstructorProfile,
  fetchEventsData,
};
