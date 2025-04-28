import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import { defaultParamsService } from 'features/constants';

/* Fetch classes by instructor username with optional filters and pagination.
 *
 * @param {string} username - The username of the instructor.
 * @param {Object} [options={}] - Optional parameters.
 * @param {boolean} [options.limit=false] - Determines if the pagination is required, true if need pagination
 * @param {string} [options.page=''] - The page number for page pagination.
 *
 * @returns {Promise} - A promise that resolves to the response from the API.
 */

function getClassesByInstructor(userName, options = {}) {
  const params = {
    instructor: userName,
    ...defaultParamsService,
    ...options,
  };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`,
    { params },
  );
}

/*
 * Fetch courses by instructor username with optional filters and pagination.
 *
 * @param {string} username - The username of the instructor.
 * @param {Object} [options={}] - Optional parameters.
 * @param {boolean} [options.limit=false] - Determines if the pagination is required, true if need pagination
 * @param {string} [options.page=''] - The page number for page pagination.
 *
 * @returns {Promise} - A promise that resolves to the response from the API.
 */
function getCoursesByInstructor(userName, options = {}) {
  const params = {
    instructor: userName,
    ...defaultParamsService,
    ...options,
  };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/courses/`,
    { params },
  );
}

export {
  getClassesByInstructor,
  getCoursesByInstructor,
};
