import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';
import AssignedClasses from 'features/Dashboard/AssignedClasses';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('Instructor Assign component', () => {
  const mockStore = {
    common: {
      allClasses: {
        data: [
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
        ],
      },
    },
  };

  const component = renderWithProviders(
    <MemoryRouter initialEntries={['/']}>
      <Route path="/">
        <AssignedClasses />
      </Route>
    </MemoryRouter>,
    { preloadedState: mockStore },
  );

  test('renders components', () => {
    const { getByText } = component;

    expect(getByText('Assigned Classes')).toBeInTheDocument();
    expect(getByText('ccx 1')).toBeInTheDocument();
    expect(getByText('Demo Course 1')).toBeInTheDocument();
    expect(getByText('Jan 23, 2024')).toBeInTheDocument();
  });
});
