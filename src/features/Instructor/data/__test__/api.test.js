import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getInstructorByEmail } from 'features/Instructor/data/api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
  })),
}));

describe('Instructor services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getInstructorByEmail', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const email = 'test@example.com';

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getInstructorByEmail(email);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/instructors/',
      { params: { instructor_email: email, limit: false } },
    );
  });
});
