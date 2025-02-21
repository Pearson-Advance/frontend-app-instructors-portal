import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';

import ClassesPage from 'features/Classes/ClassesPage';

describe('Classes page', () => {
  test('Should render the table without data', () => {
    const mockStore = {
      classes: {
        table: {
          data: [],
          count: 0,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    renderWithProviders(
      <ClassesPage />,
      { preloadedState: mockStore },
    );

    const emptyTableText = screen.getByText('No classes found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('Should render table with data', () => {
    const mockStore = {
      classes: {
        table: {
          data: [
            {
              classId: 'ccx-v1:demo+demo1+2020+ccx@40',
              className: 'Installing and exploring Node.js',
              masterCourseId: 'course-v1:demo+demo1+2020',
              masterCourseName: 'Demo Course 1',
              status: 'inProgress',
              instructors: [],
              numberOfStudents: 0,
              numberOfPendingStudents: 0,
              minStudentsAllowed: null,
              maxStudents: 200,
              startDate: '2024-08-01T00:00:00Z',
              endDate: '2024-09-29T00:00:00Z',
              institutionName: 'Institution1',
            },
            {
              classId: 'ccx-v1:demo+demo1+2020+ccx@4',
              className: 'Events and Event-Driven Architecture 2',
              masterCourseId: 'course-v1:demo+demo1+2020',
              masterCourseName: 'Demo Course 1',
              status: 'inProgress',
              instructors: [
                'instructor',
              ],
              numberOfStudents: 1,
              numberOfPendingStudents: 5,
              minStudentsAllowed: null,
              maxStudents: 2,
              startDate: '2024-10-01T00:00:00Z',
              endDate: '2024-10-29T00:00:00Z',
              institutionName: 'Institution1',
            },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/classes']}>
        <Route path="/classes">
          <ClassesPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(component.container).toHaveTextContent('Classes');
    expect(component.container).toHaveTextContent('Class');
    expect(component.container).toHaveTextContent('Course');
    expect(component.container).toHaveTextContent('Start date');
    expect(component.container).toHaveTextContent('End date');
    expect(component.container).toHaveTextContent('Min');
    expect(component.container).toHaveTextContent('Students enrolled');
    expect(component.container).toHaveTextContent('Max');
    expect(component.container).toHaveTextContent('Institution');

    expect(component.container).toHaveTextContent('Installing and exploring Node.js');
    expect(component.container).toHaveTextContent('Demo Course 1');
    expect(component.container).toHaveTextContent('08/01/24');
    expect(component.container).toHaveTextContent('0');
    expect(component.container).toHaveTextContent('200');
    expect(component.container).toHaveTextContent('Institution1');
  });
});
