import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getInstitutionName } from 'features/Main/data/api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

describe('getInstitutionName', () => {
  test('Should call getAuthenticatedHttpClient with the correct parameters', () => {
    const httpClientMock = {
      get: jest.fn(),
    };
    getAuthenticatedHttpClient.mockReturnValue(httpClientMock);

    getInstitutionName();

    expect(getAuthenticatedHttpClient).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
  });
});
