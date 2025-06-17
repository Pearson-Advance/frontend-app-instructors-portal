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

function deleteEnrollment(studentEmail, classId) {
  const BASE_URL = getConfig().LMS_BASE_URL;

  const formData = new FormData();
  formData.append('identifiers', studentEmail);
  formData.append('action', 'unenroll');

  return getAuthenticatedHttpClient().post(
    `${BASE_URL}/courses/${classId}/instructor/api/students_update_enrollment`,
    formData,
  );
}

export {
  getInstitutionName,
  deleteEnrollment,
};
