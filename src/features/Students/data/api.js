import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import { defaultParamsService } from 'features/constants';

/* Fetch students by instructor username with optional filters
 *
 * @param {string} username - The username of the instructor.
 * @param {Object} [options={}] - Optional parameters.
 * @param {string} [options.page=''] - The page number for page pagination.
 *
 * @returns {Promise} - A promise that resolves to the response from the API.
 */

function getStudentsbyInstructor(userName, options = {}) {
  const params = {
    instructor: userName,
    ...defaultParamsService,
    ...options,
  };

  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/students/`,
    { params },
  );
}

export {
  getStudentsbyInstructor,
};
