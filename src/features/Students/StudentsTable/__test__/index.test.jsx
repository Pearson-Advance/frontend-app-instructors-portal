import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import StudentsTable from 'features/Students/StudentsTable';
import { renderWithProviders } from 'test-utils';

describe('Student Table', () => {
  test('renders StudentsTable without data', () => {
    const mockStore = {
      main: {
        selectedInstitution: {
          id: 1,
        },
      },
      students: {
        table: {
          data: [],
          count: 0,
          num_pages: 1,
          current_page: 1,
        },
      },
    };
    renderWithProviders(
      <MemoryRouter initialEntries={['/students']}>
        <Route path="/students">
          <StudentsTable />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );
    const emptyTableText = screen.getByText('No students found.');
    expect(emptyTableText).toBeInTheDocument();
  });

  test('renders StudentsTable with data', () => {
    const mockStore = {
      main: {
        selectedInstitution: {
          id: 1,
        },
      },
      students: {
        table: {
          data: [
            {
              learnerName: 'Student 1',
              learnerEmail: 'student1@example.com',
              institutionName: 'Institution 1',
              courseId: 'course-v1:demo+demo1+2020',
              courseName: 'course 1',
              classId: 'ccx-v1:demo+demo1+2020+ccx@1',
              className: 'class 1',
              instructors: ['Instructor 1'],
              created: 'Fri, 25 Aug 2023 19:01:22 GMT',
              startDate: '2023-08-25T19:01:22Z',
              endDate: '2024-08-25T19:01:22Z',
              firstAccess: 'Fri, 25 Aug 2023 19:01:23 GMT',
              lastAccess: 'Fri, 25 Aug 2023 20:20:22 GMT',
              status: 'Active',
              completePercentage: 75.5,
              examReady: {
                status: 'Complete',
                lastExamDate: '2024-03-15T10:00:00Z',
                eppDaysLeft: 45,
              },
              userId: 'user1',
            },
            {
              learnerName: 'Student 2',
              learnerEmail: 'student2@example.com',
              institutionName: 'Institution 2',
              courseId: 'course-v1:demo+demo2+2020',
              courseName: 'course 2',
              classId: 'ccx-v1:demo+demo2+2020+ccx@2',
              className: 'class 2',
              instructors: ['Instructor 2'],
              created: 'Sat, 26 Aug 2023 19:01:22 GMT',
              startDate: '2023-08-26T19:01:22Z',
              endDate: '2024-08-26T19:01:22Z',
              firstAccess: 'Sat, 26 Aug 2023 19:01:24 GMT',
              lastAccess: 'Sat, 26 Aug 2023 21:22:22 GMT',
              status: 'Pending',
              completePercentage: 45.0,
              examReady: {
                status: 'Incomplete',
                lastExamDate: null,
                eppDaysLeft: null,
              },
              userId: 'user2',
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

    expect(component.container).toHaveTextContent('Institution 1');
    expect(component.container).toHaveTextContent('Institution 2');

    expect(component.container).toHaveTextContent('class 1');
    expect(component.container).toHaveTextContent('class 2');

    expect(component.container).toHaveTextContent('Pending');

    expect(component.container).toHaveTextContent('08/25/23');
    expect(component.container).toHaveTextContent('08/26/23');

    expect(component.container).toHaveTextContent('03/15/24');

    expect(component.container).toHaveTextContent('45');

    expect(screen.queryByText('No students found.')).toBeNull();
  });

  test('renders StudentsTable with complete table structure', () => {
    const mockStore = {
      main: {
        selectedInstitution: {
          id: 1,
        },
      },
      students: {
        table: {
          data: [
            {
              learnerName: 'Test Student',
              learnerEmail: 'test@example.com',
              institutionName: 'Test Institution',
              courseId: 'course-v1:test+test+2024',
              courseName: 'Test Course',
              classId: 'ccx-v1:test+test+2024+ccx@1',
              className: 'Test Class',
              status: 'Active',
              startDate: '2024-01-01T00:00:00Z',
              endDate: '2024-12-31T23:59:59Z',
              completePercentage: 50.0,
              examReady: {
                status: 'Complete',
                lastExamDate: '2024-03-15T10:00:00Z',
                eppDaysLeft: 30,
              },
              userId: 'testuser',
            },
          ],
          count: 1,
          num_pages: 1,
          current_page: 1,
        },
      },
    };

    renderWithProviders(
      <MemoryRouter initialEntries={['/students']}>
        <Route path="/students">
          <StudentsTable />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Institution')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Class Name')).toBeInTheDocument();
    expect(screen.getByText('Start - End Date')).toBeInTheDocument();
    expect(screen.getByText('Current Grade')).toBeInTheDocument();
    expect(screen.getByText('Exam Ready')).toBeInTheDocument();
    expect(screen.getByText('Last exam date')).toBeInTheDocument();
    expect(screen.getByText('Epp days left')).toBeInTheDocument();
  });

  test('renders StudentsTable with placeholder values when data is null', () => {
    const mockStore = {
      main: {
        selectedInstitution: {
          id: 1,
        },
      },
      students: {
        table: {
          data: [
            {
              learnerName: 'Student Without Dates',
              learnerEmail: 'nodates@example.com',
              institutionName: 'Test Institution',
              courseId: 'course-v1:test+test+2024',
              courseName: 'Test Course',
              classId: 'ccx-v1:test+test+2024+ccx@1',
              className: 'Test Class',
              status: 'Active',
              startDate: null,
              endDate: null,
              completePercentage: 0,
              examReady: {
                status: 'Incomplete',
                lastExamDate: null,
                eppDaysLeft: null,
              },
              userId: 'testuser',
            },
          ],
          count: 1,
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

    expect(component.container).toHaveTextContent('--');
  });
});
