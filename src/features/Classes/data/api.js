import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function handleEnrollments(data, classId) {
  const ENROLLMENT_API_URL = `${getConfig().LMS_BASE_URL}/courses/${classId}/instructor/api/students_update_enrollment`;

  return getAuthenticatedHttpClient().post(
    ENROLLMENT_API_URL,
    data,
  );
}

function getMessages() {
  return getAuthenticatedHttpClient().get(
    `${getConfig().LMS_BASE_URL}/pearson_course_operation/api/messages/get-messages/`,
  );
}

export {
  handleEnrollments,
  getMessages,
};
