import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { MemoryRouter } from 'react-router-dom';

import WeeklySchedule from 'features/Dashboard/WeeklySchedule';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('react-date-range', () => ({
  Calendar: () => <div>Calendar</div>,
}));

jest.mock('date-fns', () => ({
  startOfWeek: jest.fn(() => new Date(2023, 1, 23)),
  endOfWeek: jest.fn(() => null),
  isWithinInterval: jest.fn(() => true),
  format: jest.fn(() => 'Jan 23, 2024'),
}));

describe('WeeklySchedule component', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  const mockStore = {
    common: {
      allClasses: {
        data: [
          {
            classId: 'ccx-v1:demo+demo1+2020+ccx1',
            className: 'ccx 1',
            masterCourseName: 'Demo Course 1',
            instructors: [
              'instructor1',
            ],
            numberOfStudents: 0,
            numberOfPendingStudents: 0,
            maxStudents: 20,
            startDate: '2023-01-23T21:50:51Z',
            endDate: null,
          },
          {
            classId: 'ccx-v1:demo+demo1+2020+ccx2',
            className: 'ccx 2',
            masterCourseName: 'Demo Course 1',
            instructors: [
              'instructor1',
            ],
            numberOfStudents: 0,
            numberOfPendingStudents: 0,
            maxStudents: 20,
            startDate: '2023-01-23T21:50:51Z',
            endDate: null,
          },
        ],
      },
    },
  };
  const component = renderWithProviders(
    <MemoryRouter>
      <WeeklySchedule />
    </MemoryRouter>,
    { preloadedState: mockStore },
  );

  test('renders components', () => {
    const { getByText, getAllByText } = component;

    expect(getByText('Class schedule')).toBeInTheDocument();
    expect(getByText('ccx 1')).toBeInTheDocument();
    expect(getAllByText('Jan 23, 2024')).toHaveLength(2);
    expect(getByText('ccx 2')).toBeInTheDocument();
  });
});
