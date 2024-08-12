import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  updateStudent,
  updateStudentsTable,
  updateStudentsRequestStatus,
  updateStudentProfileRequestStatus,
} from 'features/Students/data/slice';
import {
  getStudentsbyInstructor,
} from 'features/Students/data/api';

import { RequestStatus } from 'features/constants';

function fetchStudentsData(userName, options = {}) {
  return async (dispatch) => {
    dispatch(updateStudentsRequestStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(await getStudentsbyInstructor(userName, options));
      dispatch(updateStudentsTable(response.data));
    } catch (error) {
      dispatch(updateStudentsRequestStatus(RequestStatus.ERROR));
      logError(error);
    }
  };
}

function fetchStudentProfile(userName, options = {}) {
  return async (dispatch) => {
    dispatch(updateStudentProfileRequestStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(await getStudentsbyInstructor(userName, options));
      const studentInfo = {
        ...response.data.results[0] || {},
      };

      dispatch(updateStudent(studentInfo));
      dispatch(updateStudentProfileRequestStatus(RequestStatus.INITIAL));
    } catch (error) {
      logError(error);
      dispatch(updateStudentProfileRequestStatus(RequestStatus.ERROR));
    }
  };
}

export {
  fetchStudentsData,
  fetchStudentProfile,
};
