import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import StudentsTable from 'features/Students/StudentsTable';
import { renderWithProviders } from 'test-utils';

describe('Student Table', () => {
  test('renders StudentsTable without data', () => {
    const mockStore = {
      students: {
        table: {
          data: [],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
      },
    };
    renderWithProviders(
      <StudentsTable />,
      { preloadedState: mockStore },
    );
    const emptyTableText = screen.getByText('No students found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('renders StudentsTable with data', () => {
    const mockStore = {
      students: {
        table: {
          data: [
            {
              learnerName: 'Student 1',
              learnerEmail: 'student1@example.com',
              courseId: '1',
              courseName: 'course 1',
              classId: '1',
              className: 'class 1',
              instructors: ['Instructor 1'],
              created: 'Fri, 25 Aug 2023 19:01:22 GMT',
              firstAccess: 'Fri, 25 Aug 2023 19:01:23 GMT',
              lastAccess: 'Fri, 25 Aug 2023 20:20:22 GMT',
              status: 'Active',
              examReady: true,
            },
            {
              learnerName: 'Student 2',
              learnerEmail: 'student2@example.com',
              courseId: '2',
              courseName: 'course 2',
              classId: '2',
              className: 'class 2',
              instructors: ['Instructor 2'],
              created: 'Sat, 26 Aug 2023 19:01:22 GMT',
              firstAccess: 'Sat, 26 Aug 2023 19:01:24 GMT',
              lastAccess: 'Sat, 26 Aug 2023 21:22:22 GMT',
              status: 'Pending',
              examReady: null,
            },
          ],
          count: 2,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    const component = renderWithProviders(
      <MemoryRouter initialEntries={['/students']}>
        <Route path="/students">
          <StudentsTable />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(component.container).toHaveTextContent('Student 1');
    expect(component.container).toHaveTextContent('Student 2');

    expect(component.container).toHaveTextContent('student1@example.com');
    expect(component.container).toHaveTextContent('student2@example.com');

    expect(component.container).toHaveTextContent('class 1');
    expect(component.container).toHaveTextContent('class 2');

    expect(component.container).toHaveTextContent('Yes');
    expect(component.container).toHaveTextContent('No');

    expect(screen.queryByText('No students found.')).toBeNull();
  });
});
