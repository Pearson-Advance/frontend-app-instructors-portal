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

function getEventsByInstructor(params) {
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/events/`,
    { params },
  );
}

export {
  getInstructorByEmail,
  postInstructorEvent,
  getEventsByInstructor,
};
