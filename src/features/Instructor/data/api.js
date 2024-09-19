import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getInstructorByEmail(email, options = {}) {
  const defaultParams = {
    limit: false,
  };

  const params = {
    instructor_email: email,
    ...defaultParams,
    ...options,
  };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/`,
    { params },
  );
}

function postInstructorEvent(eventData) {
  const params = new URLSearchParams(eventData).toString();

  return getAuthenticatedHttpClient().post(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/events/?${params}`,
  );
}

/**
 * Get events list by instructor.
 *
 * @param {object} - An object with the start and end date range for the calendar
 *                   Dates in format ISO
 * @returns {Promise} - A promise that resolves with the response of the GET request.
 */
function getEventsByInstructor(params) {
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/events/`,
    { params },
  );
}

/**
 * Delete event.
 *
 * @param {number} - Event id to be deleted
 * @returns {Promise} - A promise that resolves with the response of the DELETE request.
 */
function deleteEvent(eventId) {
  const params = {
    event_id: eventId,
  };
  return getAuthenticatedHttpClient().delete(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/events/`,
    { params },
  );
}

export {
  getInstructorByEmail,
  postInstructorEvent,
  getEventsByInstructor,
  deleteEvent,
};
