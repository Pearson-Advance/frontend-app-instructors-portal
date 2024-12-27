import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getClassesByInstructor } from 'features/Common/data/api';
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

describe('Common api services', () => {
  const COURSE_OPERATIONS_API_V2 = 'http://localhost:18000/pearson_course_operation/api/v2';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call getClassesByInstructor with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const instructor = 'instructor01';

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getClassesByInstructor(instructor);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${COURSE_OPERATIONS_API_V2}/classes/`,
      {
        params: {
          instructor,
          limit: false,
          page: '',
          page_size: MAX_TABLE_RECORDS,
        },
      },
    );
  });
});
