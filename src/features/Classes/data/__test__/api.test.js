import {
  handleEnrollments, getMessages, handleSkillableDashboard, handleXtremeLabsDashboard,
} from 'features/Classes/data/api';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
  })),
}));

describe('handleEnrollments', () => {
  test('should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({}),
    };
    const courseId = 'course123';
    const data = new FormData();

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    handleEnrollments(data, courseId);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://localhost:18000/courses/course123/instructor/api/students_update_enrollment',
      data,
    );
  });
});

describe('getMessages', () => {
  test('should call getMessages', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getMessages();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/messages/get-messages/',
    );
  });
});

describe('handleSkillableDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      post: jest.fn().mockResolvedValue({}),
    };
    const courseId = 'course456';

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    handleSkillableDashboard(courseId);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://localhost:18000/skillable_plugin/course-tab/api/v1/instructor-dashboard-launch/',
      { class_id: courseId },
    );
  });
});

describe('handleXtremeLabsDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      post: jest.fn().mockResolvedValue({}),
    };
    const courseId = 'course789';

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    handleXtremeLabsDashboard(courseId);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://localhost:18000/xtreme_labs_plugin/course-tab/api/v1/instructor-dashboard-launch/',
      { class_id: courseId },
    );
  });
});
