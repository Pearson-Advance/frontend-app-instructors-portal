import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
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
    events: {
      data: [
        {
          id: 1,
          title: 'Not available',
          start: '2024-09-04T00:00:00Z',
          end: '2024-09-13T00:00:00Z',
          type: 'virtual',
        },
      ],
      count: 1,
      num_pages: 1,
      current_page: 1,
    },
  },
  classes: {
    table: {
      next: null,
      previous: null,
      count: 1,
      numPages: 1,
      currentPage: 1,
      start: 0,
      data: [
        {
          classId: 'ccx-v1:demo+demo1+2020+ccx@40',
          className: 'Installing and exploring Node.js',
          masterCourseId: 'course-v1:demo+demo1+2020',
          masterCourseName: 'Demo Course 1',
          status: 'in_progress',
          numberOfStudents: 0,
          numberOfPendingStudents: 0,
          minStudentsAllowed: null,
          maxStudents: 200,
          startDate: '2024-08-22T00:00:00Z',
          endDate: '2027-11-17T00:00:00Z',
          instructors: [
            'instructor_admin_1',
          ],
        },
      ],
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
        <MemoryRouter initialEntries={['/']}>
          <Route path="/">
            <Profile />
          </Route>
        </MemoryRouter>
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

      /* Table */
      expect(getByText('Class')).toBeInTheDocument();
      expect(getByText('Installing and exploring Node.js')).toBeInTheDocument();

      expect(getByText('Course')).toBeInTheDocument();
      expect(getByText('Demo Course 1')).toBeInTheDocument();

      expect(getByText('Start - End Date')).toBeInTheDocument();
      expect(getByText('08/22/24 - 11/17/27')).toBeInTheDocument();

      expect(getByText('Status')).toBeInTheDocument();
      expect(getByText('in progress')).toBeInTheDocument();
    });
  });
});
