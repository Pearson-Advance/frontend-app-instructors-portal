import React from 'react';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AppContext } from '@edx/frontend-platform/react';

import Profile from 'features/Instructor/Profile';

import { renderWithProviders } from 'test-utils';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  main: {
    username: 'instructor123',
    email: 'test@example.com',
  },
  instructor: {
    info: {
      instructorImage: '',
      instructorUsername: 'InstructoTest',
      instructorName: 'InstructorTest',
      instructorEmail: 'instructor@example.com',
      lastAccess: '2024-08-15T16:08:10.343823Z',
      created: '2023-10-04T15:02:16Z',
      classes: 4,
    },
  },
};

describe('Instructor Profile', () => {
  const authenticatedUser = {
    username: 'instructor123',
    email: 'test@example.com',
  };

  const config = {
    ACCOUNT_PROFILE_URL: 'https://example.com/profile',
    LMS_BASE_URL: 'http://localhost:1990',
  };

  test('Should render the component', () => {
    const { getByText } = renderWithProviders(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Profile />
      </AppContext.Provider>,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(getByText('Instructor')).toBeInTheDocument();
      expect(getByText('InstructorTest')).toBeInTheDocument();
      expect(getByText('instructor@example.com')).toBeInTheDocument();
      expect(getByText('Instructor since')).toBeInTheDocument();
      expect(getByText('10/04/23')).toBeInTheDocument();
      expect(getByText('last online')).toBeInTheDocument();
      expect(getByText('08/15/24')).toBeInTheDocument();
    });
  });
});
