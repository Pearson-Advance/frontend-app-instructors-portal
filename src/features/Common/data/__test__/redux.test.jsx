import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { fetchAllClassesData } from 'features/Common/data';
import { executeThunk } from 'test-utils';
import { initializeStore } from 'store';

let axiosMock;
let store;

describe('Dashboard redux tests', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 1,
        username: 'testuser',
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

  test('successful fetch classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`;
    const mockResponse = [
      {
        classId: 'ccx-v1:demo+demo1+2020+ccx1',
        className: 'ccx 1',
        masterCourseName: 'Demo Course 1',
        instructors: [],
        numberOfStudents: 0,
        numberOfPendingStudents: 0,
        maxStudents: 20,
        startDate: '2024-01-23T21:50:51Z',
        endDate: null,
      },
    ];
    const instructor = 'instructor01';
    axiosMock.onGet(classesApiUrl)
      .reply(200, mockResponse);

    expect(store.getState().common.allClasses.status)
      .toEqual('initial');

    await executeThunk(fetchAllClassesData(instructor), store.dispatch, store.getState);

    expect(store.getState().common.allClasses.data)
      .toEqual(mockResponse);

    expect(store.getState().common.allClasses.status)
      .toEqual('success');
  });

  test('failed fetch classes data', async () => {
    const classesApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/classes/`;
    const instructor = 'instructor01';
    axiosMock.onGet(classesApiUrl)
      .reply(500);

    expect(store.getState().common.allClasses.status)
      .toEqual('initial');

    await executeThunk(fetchAllClassesData(instructor), store.dispatch, store.getState);

    expect(store.getState().common.allClasses.data)
      .toEqual([]);

    expect(store.getState().common.allClasses.status)
      .toEqual('error');
  });
});
