import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getInstitutionName() {
  const params = {
    instructor_portal: true,
  };
  return getAuthenticatedHttpClient().get(
    `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/institutions/?limit=false`,
    { params },
  );
}

export {
  getInstitutionName,
};
