import React from 'react';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';

import { RequestStatus } from 'features/constants';
import StudentsDetails from 'features/Students/StudentsDetails';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  main: { username: 'instructor123' },
  students: {
    table: {
      status: RequestStatus.INITIAL,
      data: [],
    },
    student: {
      learnerName: 'student123',
      learnerEmail: 'student123@example.com',
      courseId: 'course-v1:demo+demo1+2020',
      courseName: 'Demo Course 1',
      classId: 'ccx-v1:demo+demo1+2020+ccx@4',
      className: 'Events and Event-Driven Architecture 2',
      created: '2024-02-13T17:56:08.646779Z',
      status: 'Active',
      examReady: false,
      startDate: '2024-08-01T00:00:00Z',
      endDate: '2024-08-29T00:00:00Z',
      lastAccess: '2024-02-13 18:51:38.916464',
      completePercentage: 0,
      userImageUrl: '/static/images/profiles/default_500.png',
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

describe('StudentsDetails', () => {
  test('Should render the options', () => {
    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={['/students/student123']}>
        <Route path="/students/:learnerName">
          <StudentsDetails />,
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    waitFor(() => {
      expect(getByText('Student')).toBeInTheDocument();
      expect(getByText('student123')).toBeInTheDocument();
      expect(getByText('student123@example.com')).toBeInTheDocument();
      expect(getByText('recent courses taken')).toBeInTheDocument();
      expect(getByText('events and event-driven architecture 2')).toBeInTheDocument();
      expect(getByText('student since')).toBeInTheDocument();
      expect(getByText('02/13/24')).toBeInTheDocument();

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
