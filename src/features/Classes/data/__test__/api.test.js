import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getClassesByInstructor } from 'features/Classes/data/api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
  })),
}));

describe('getClassesByInstructor', () => {
  test('Should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const instructor = 'instructor01';
    const params = {
      page: 1,
    };

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getClassesByInstructor(instructor, params);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/classes/',
      { params: { instructor, page: 1 } },
    );
  });
});
