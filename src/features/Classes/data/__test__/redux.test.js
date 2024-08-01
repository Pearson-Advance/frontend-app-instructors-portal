import MockAdapter from 'axios-mock-adapter';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getClasses } from 'features/Classes/data/thunks';
import { updateCurrentPage } from 'features/Classes/data/slice';

import { executeThunk } from 'test-utils';
import { initializeStore } from 'store';

let axiosMock;
let store;

describe('Classes reducer', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 1,
        username: 'test_user',
        administrator: true,
        roles: [],
      },
    });
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());

    store = initializeStore();
  });

  afterEach(() => {
    axiosMock.reset();
  });

  test('Should get fetch classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`;
    const mockResponse = {
      results: [
        {
          classId: 'ccx-v1:demo+demo1+2020+ccx@4',
          className: 'Events and Event-Driven Architecture 2',
          masterCourseId: 'course-v1:demo+demo1+2020',
          masterCourseName: 'Demo Course 1',
          status: 'complete',
          numberOfStudents: 1,
          instructors: ['test_user'],
          numberOfPendingStudents: 5,
          minStudentsAllowed: 1,
          maxStudents: 2,
          startDate: '2024-07-10T00:00:00Z',
          endDate: '2024-07-12T00:00:00Z',
        },
      ],
      count: 2,
      num_pages: 1,
      current_page: 1,
    };
    axiosMock.onGet(classesApiUrl).reply(200, mockResponse);

    expect(store.getState().classes.table.status).toEqual('initial');

    await executeThunk(getClasses(), store.dispatch, store.getState);

    expect(store.getState().classes.table.data).toEqual(mockResponse.results);
  });

  test('Should fail fetch classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`;
    axiosMock.onGet(classesApiUrl).reply(500);

    expect(store.getState().classes.table.status).toEqual('initial');

    await executeThunk(getClasses(), store.dispatch, store.getState);

    expect(store.getState().classes.table.data).toEqual([]);

    expect(store.getState().classes.table.status).toEqual('error');
  });

  test('Should update current page', () => {
    const newPage = 2;
    const initialState = store.getState().classes.table;
    const expectState = {
      ...initialState,
      currentPage: newPage,
    };

    store.dispatch(updateCurrentPage(newPage));
    expect(store.getState().classes.table).toEqual(expectState);
  });
});
