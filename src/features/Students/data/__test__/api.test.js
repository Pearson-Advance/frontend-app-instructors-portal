import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getStudentsbyInstructor } from 'features/Students/data/api';
import { MAX_TABLE_RECORDS } from 'features/constants';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
  })),
}));

describe('getStudentsbyInstructor', () => {
  test('should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const instructor = 'instructor01';
    const params = {
      page: 1,
    };

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getStudentsbyInstructor(instructor, params);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/students/',
      { params: { instructor, page: 1, page_size: MAX_TABLE_RECORDS } },
    );
  });
});
