import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { initializeStore } from 'store';

import {
  fetchInstructorProfile,
  fetchEventsData,
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

  describe('Instructor availability', () => {
    test('successful fetch instructor events', async () => {
      const instructorApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/events/`;
      const mockResponse = {
        count: 1,
        num_pages: 1,
        current_page: 1,
        results: [
          {
            id: 1,
            title: 'Not available',
            start: '2024-09-04T00:00:00Z',
            end: '2024-09-13T00:00:00Z',
            type: 'virtual',
          },
        ],
      };
      const dates = {
        start_date: '2024-09-01T00:00:00.000Z',
        ens_date: '2024-10-06T00:00:00.000Z',
      };

      axiosMock.onGet(instructorApiUrl).reply(200, mockResponse);

      await executeThunk(fetchEventsData(dates), store.dispatch, store.getState);

      expect(store.getState().instructor.events.status).toEqual('success');
    });

    test('Should fetch multiple pages of instructor events', async () => {
      const instructorApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/events/`;

      const mockResponsePage1 = {
        count: 2,
        num_pages: 2,
        next: '/events?page=2',
        current_page: 1,
        results: [
          {
            id: 1,
            title: 'Not available',
            start: '2024-09-04T00:00:00Z',
            end: '2024-09-13T00:00:00Z',
            type: 'virtual',
          },
        ],
      };

      const mockResponsePage2 = {
        count: 2,
        num_pages: 2,
        next: null,
        current_page: 2,
        results: [
          {
            id: 2,
            title: 'Available',
            start: '2024-09-14T00:00:00Z',
            end: '2024-09-20T00:00:00Z',
            type: 'virtual',
          },
        ],
      };

      const dates = {
        start_date: '2024-09-01T00:00:00.000Z',
        end_date: '2024-10-06T00:00:00.000Z',
      };

      axiosMock.onGet(instructorApiUrl).replyOnce(200, mockResponsePage1);
      axiosMock.onGet(instructorApiUrl).replyOnce(200, mockResponsePage2);

      await executeThunk(fetchEventsData(dates), store.dispatch, store.getState);

      expect(store.getState().instructor.events.status).toEqual('success');

      expect(axiosMock.history.get.length).toBe(2);
    });

    test('fetch instructor events with error', async () => {
      const dates = {
        start_date: '2024-09-01T00:00:00.000Z',
        ens_date: '2024-10-06T00:00:00.000Z',
      };

      axiosMock.onGet('/events/').reply(500);

      await executeThunk(fetchEventsData(dates), store.dispatch, store.getState);

      expect(store.getState().instructor.events.status).toEqual('error');
    });
  });
});
