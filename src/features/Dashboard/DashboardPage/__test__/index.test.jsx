import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { MemoryRouter, Route } from 'react-router-dom';

import { AppContext } from '@edx/frontend-platform/react';

import DashboardPage from 'features/Dashboard/DashboardPage';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('DashboardPage component', () => {
  const mockStore = {
    main: {
      username: 'User',
    },
    common: {
      allClasses: {
        data: [
          {
            classId: 'ccx-v1:demo+demo1+2020+ccx2',
            className: 'ccx 2',
            masterCourseName: 'Demo Course 1',
            instructors: [],
            numberOfStudents: 0,
            numberOfPendingStudents: 0,
            maxStudents: 20,
            startDate: '2024-01-23T21:50:51Z',
            endDate: null,
          },
        ],
      },
    },
  };

  const authenticatedUser = {
    name: 'Sam Smith',
    email: 'test@example.com',
  };

  const config = {
    LMS_BASE_URL: 'http://localhost:1990',
  };

  const component = renderWithProviders(
    <AppContext.Provider value={{ authenticatedUser, config }}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Route path="/dashboard">
          <DashboardPage />
        </Route>
      </MemoryRouter>,
    </AppContext.Provider>,
    { preloadedState: mockStore },
  );

  test('renders components', () => {
    const { getByText } = component;

    expect(getByText('Welcome Sam')).toBeInTheDocument();
    expect(getByText('Class schedule')).toBeInTheDocument();
    expect(getByText('No classes scheduled at this time')).toBeInTheDocument();
  });
});
