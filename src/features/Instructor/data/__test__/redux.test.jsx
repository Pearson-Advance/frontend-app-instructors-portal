import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { initializeStore } from 'store';

import {
  fetchInstructorProfile,
} from 'features/Instructor/data';

import { executeThunk } from 'test-utils';

let axiosMock;
let store;

describe('Instructor redux tests', () => {
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

  describe('Instructor profile', () => {
    test('successful fetch instructor profile', async () => {
      const instructorApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/instructors/`;
      const mockResponse = {
        instructorImage: '',
        instructorUsername: 'InstructoTest',
        instructorName: 'InstructorTest',
        instructorEmail: 'instructor@example.com',
        lastAccess: '2024-08-15T16:08:10.343823Z',
        created: '2023-10-04T15:02:16Z',
        classes: 4,
      };
      const email = 'test@example.com';

      axiosMock.onGet(instructorApiUrl).reply(200, mockResponse);

      await executeThunk(fetchInstructorProfile(email), store.dispatch, store.getState);

      expect(store.getState().instructor.info.status).toEqual('success');
    });

    test('fetch instructor profile with error', async () => {
      const email = 'test@example.com';

      axiosMock.onGet('/instructors/').reply(500);

      await executeThunk(fetchInstructorProfile(email), store.dispatch, store.getState);

      expect(store.getState().instructor.info.status).toEqual('error');
    });
  });
});
