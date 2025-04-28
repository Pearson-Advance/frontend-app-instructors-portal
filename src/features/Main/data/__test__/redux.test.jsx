import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';

import { initializeStore } from 'store';
import { executeThunk } from 'test-utils';
import { fetchInstitutionData } from 'features/Main/data';

let axiosMock;
let store;

describe('Main redux actions', () => {
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

  describe('Institutions', () => {
    test('Successful fetch instructors data', async () => {
      const institutionApiUrl = `${process.env.COURSE_OPERATIONS_API_V2_BASE_URL}/institutions/?limit=false`;
      const mockResponse = [
        {
          id: 1,
          name: 'Institution1',
          shortName: 'Inst1',
          active: true,
        },
      ];
      axiosMock.onGet(institutionApiUrl)
        .reply(200, mockResponse);

      expect(store.getState().main.institutions.status)
        .toEqual('loading');

      await executeThunk(fetchInstitutionData(), store.dispatch, store.getState);

      expect(store.getState().main.institutions.data)
        .toEqual(mockResponse);

      expect(store.getState().main.institutions.status)
        .toEqual('success');
    });
  });
});
