import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  getInstructorByEmail, postInstructorEvent, getEventsByInstructor, deleteEvent, editEvent,
} from 'features/Instructor/data/api';

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
      {
        params: {
          instructor_email: email,
          limit: false,
          instructor_portal: true,
        },
      },
    );
  });

  test('postInstructorEvent', () => {
    const httpClientMock = {
      post: jest.fn(),
    };

    const eventDataRequest = {
      title: 'Not available',
      start: '2024-09-13T00:00:00.000Z',
      end: '2024-09-13T00:00:00.000Z',
    };

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    postInstructorEvent(eventDataRequest);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/events/?title=Not+available&start=2024-09-13T00%3A00%3A00.000Z&end=2024-09-13T00%3A00%3A00.000Z',
    );
  });

  test('getEventsByInstructor', () => {
    const httpClientMock = {
      get: jest.fn(),
    };

    const dates = {
      start_date: '2024-05-26T00:00:00.000Z',
      ens_date: '2024-07-07T00:00:00.000Z',
    };

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getEventsByInstructor(dates);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/events/',
      { params: { ...dates } },
    );
  });

  test('delete event', () => {
    const httpClientMock = {
      delete: jest.fn(),
    };

    const eventId = 1;

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    deleteEvent(eventId);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.delete).toHaveBeenCalledTimes(1);
    expect(httpClientMock.delete).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/events/',
      { params: { event_id: eventId } },
    );
  });

  test('Edit event', () => {
    const httpClientMock = {
      patch: jest.fn(),
    };

    const eventDataRequest = {
      event_id: 1,
      title: 'Not available',
      start: '2024-09-13T00:00:00.000Z',
      end: '2024-09-13T00:00:00.000Z',
    };

    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    editEvent(eventDataRequest);

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedHttpClient).toHaveBeenCalledWith();

    expect(httpClientMock.patch).toHaveBeenCalledTimes(1);
    expect(httpClientMock.patch).toHaveBeenCalledWith(
      'http://localhost:18000/pearson_course_operation/api/v2/events/?event_id=1&title=Not+available&start=2024-09-13T00%3A00%3A00.000Z&end=2024-09-13T00%3A00%3A00.000Z',
    );
  });
});
