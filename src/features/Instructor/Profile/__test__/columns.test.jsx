import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import { renderWithProviders } from 'test-utils';

import { columns } from 'features/Instructor/Profile/columns';

describe('Columns of instructor profile', () => {
  test('Should return an array of columns with correct properties', () => {
    expect(columns).toBeInstanceOf(Array);
    expect(columns).toHaveLength(4);

    const [
      className,
      course,
      dates,
      status,
    ] = columns;

    expect(className).toHaveProperty('Header', 'Class');
    expect(className).toHaveProperty('accessor', 'className');

    expect(course).toHaveProperty('Header', 'Course');
    expect(course).toHaveProperty('accessor', 'masterCourseName');

    expect(dates).toHaveProperty('Header', 'Start - End Date');
    expect(dates).toHaveProperty('accessor', 'startDate');

    expect(status).toHaveProperty('Header', 'Status');
    expect(status).toHaveProperty('accessor', 'status');
  });

  test('Should render the class title into a link', async () => {
    const ClassColumn = () => columns[0].Cell({
      row: {
        original: {
          classId: 'demo+example+class+id',
        },
        values: {
          className: 'Example class',
        },
      },
    });

    const mockStore = {
      main: {
        selectedInstitution: {
          id: 1,
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
          results: [
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

    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/">
          <ClassColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const linkElement = getByText('Example class');

    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute('href')).toBe('/classes/demo+example+class+id?previous=my-profile');
  });

  test('Should show the course title', async () => {
    const CourseColumn = () => columns[1].Cell({
      row: {
        values: {
          masterCourseName: 'Demo Course 1',
        },
      },
    });

    const mockStore = {
      main: {
        selectedInstitution: {
          id: 1,
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
          results: [
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

    const { getByText } = renderWithProviders(
      <CourseColumn />,
      { preloadedState: mockStore },
    );

    expect(getByText('Demo Course 1')).toBeInTheDocument();
  });

  test('Should format the dates', async () => {
    const mockStore = {
      main: {
        selectedInstitution: {
          id: 1,
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
          results: [
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

    const FullDates = () => columns[2].Cell({
      row: {
        original: {
          endDate: '2027-11-17T00:00:00Z',
        },
        values: {
          startDate: '2024-08-22T00:00:00Z',
        },
      },
    });

    const { getByText } = renderWithProviders(
      <FullDates />,
      { preloadedState: mockStore },
    );

    expect(getByText('08/22/24 - 11/17/27')).toBeInTheDocument();
  });
});
