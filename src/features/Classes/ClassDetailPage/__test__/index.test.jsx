import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import { renderWithProviders } from 'test-utils';
import ClassDetailPage from 'features/Classes/ClassDetailPage';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    GRADEBOOK_MICROFRONTEND_URL: 'http://localhost:18000',
  })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  main: {
    username: 'User',
  },
  students: {
    table: {
      next: null,
      previous: null,
      count: 1,
      numPages: 1,
      currentPage: 1,
      start: 0,
      results: [
        {
          learnerName: 'Test User',
          learnerEmail: 'testuser@example.com',
          courseId: 'course-v1:demo+demo1+2020',
          courseName: 'Demo Course 1',
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
          className: 'test ccx1',
          created: '2024-02-13T18:31:27.399407Z',
          status: 'Active',
          examReady: false,
          startDate: '2024-02-13T17:42:22Z',
          endDate: null,
          completePercentage: 0.0,
        },
      ],
    },
  },
  common: {
    allClasses: {
      data: [
        {
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
          className: 'test ccx1',
          masterCourseId: 'course-v1:demo+demo1+2020',
          masterCourseName: 'Demo Course 1',
          status: 'in_progress',
          instructors: [
            'User',
          ],
          numberOfStudents: 2,
          numberOfPendingStudents: 1,
          minStudentsAllowed: null,
          maxStudents: 200,
          startDate: '2024-04-03T00:00:00Z',
          endDate: null,
          labSummaryUrl: 'https: //',
        },
      ],
    },
  },
};

const { classId } = mockStore.common.allClasses.data[0];

/**
 * Helper function to render the component with default props and mocked state.
 */
const renderClassDetailPage = () => renderWithProviders(
  <MemoryRouter initialEntries={[`/classes/${classId}`]}>
    <Route path="/classes/:classId">
      <ClassDetailPage />
    </Route>
  </MemoryRouter>,
  { preloadedState: mockStore },
);

describe('ClassDetailPage', () => {
  beforeAll(() => {
    jest.spyOn(window, 'open').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('renders class details', async () => {
    const component = renderClassDetailPage();

    await waitFor(() => {
      expect(component.container).toHaveTextContent('Class details: test ccx1');
      expect(component.container).toHaveTextContent('No');
      expect(component.container).toHaveTextContent('Student');
      expect(component.container).toHaveTextContent('Email');
      expect(component.container).toHaveTextContent('Status');
      expect(component.container).toHaveTextContent('Courseware Progress');
      expect(component.container).toHaveTextContent('Exam ready');
      expect(component.container).toHaveTextContent('Demo Course 1');
      expect(component.container).toHaveTextContent('Apr 3, 2024');
      expect(component.container).toHaveTextContent('Enrollment:enrolled 3, maximum 200');
    });
  });

  test('renders extra options in the dropdown', () => {
    const component = renderClassDetailPage();

    const dropdownToggle = component.getByLabelText('menu for actions');
    fireEvent.click(dropdownToggle);

    expect(component.getByText('Gradebook')).toBeInTheDocument();
    expect(component.getByText('Lab summary')).toBeInTheDocument();
  });

  test('opens Gradebook in a new tab', async () => {
    const component = renderClassDetailPage();

    const dropdownToggle = component.getByLabelText('menu for actions');
    fireEvent.click(dropdownToggle);

    const gradebookItem = component.getByText('Gradebook');
    fireEvent.click(gradebookItem);

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(
        `http://localhost:18000/gradebook/${classId}`,
        '_blank',
        'noopener,noreferrer',
      );
    });
  });
});

describe('Enrollment access', () => {
  test('Should hide enroll student button if the instructor does not have the privilege', () => {
    const state = {
      ...mockStore,
      instructor: {
        info: {
          hasEnrollmentPrivilege: false,
        },
      },
    };

    renderWithProviders(
      <MemoryRouter initialEntries={[`/classes/${classId}`]}>
        <Route path="/classes/:classId">
          <ClassDetailPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: state },
    );

    expect(screen.queryByText('Invite student to enroll')).not.toBeInTheDocument();
  });

  test('Should display enroll student button if the instructor has the privilege', () => {
    const state = {
      ...mockStore,
      instructor: {
        info: {
          hasEnrollmentPrivilege: true,
        },
      },
    };

    renderWithProviders(
      <MemoryRouter initialEntries={[`/classes/${classId}`]}>
        <Route path="/classes/:classId">
          <ClassDetailPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: state },
    );

    expect(screen.getByText('Invite student to enroll')).toBeInTheDocument();
  });
});
