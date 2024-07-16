import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getClassesByInstructor(instructorUsername, limit = false, page = '', urlParamsFilters = '') {
  const params = {
    limit,
    instructor: instructorUsername,
    page,
    ...urlParamsFilters,
  };
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`,
    { params },
  );
}

export {
  getClassesByInstructor,
};
