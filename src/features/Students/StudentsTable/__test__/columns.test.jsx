import { fireEvent } from '@testing-library/react';
import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';

import { getColumns } from 'features/Students/StudentsTable/columns';

describe('getColumns', () => {
  const mockStore = {
    main: {
      selectedInstitution: {
        id: 1,
      },
    },
    students: {
      table: {
        next: null,
        previous: null,
        count: 1,
        numPages: 1,
        currentPage: 1,
        start: 0,
        data: [
          {
            learnerName: 'Test User',
            learnerEmail: 'testuser@example.com',
            courseId: 'course-v1:demo+demo1+2020',
            courseName: 'Demo Course 1',
            classId: 'ccx-v1:demo+demo1+2020+ccx@3',
            className: 'test ccx1',
            institutionName: 'Test Institution',
            created: '2024-02-13T18:31:27.399407Z',
            status: 'Active',
            examReady: {
              status: 'Complete',
              lastExamDate: '2024-03-15T10:00:00Z',
              eppDaysLeft: 45,
            },
            startDate: '2024-02-13T17:42:22Z',
            endDate: '2024-12-31T23:59:59Z',
            completePercentage: 75.5,
            userId: 'user123',
          },
        ],
      },
    },
  };

  test('returns an array of columns with correct properties', () => {
    expect(getColumns()).toBeInstanceOf(Array);
    expect(getColumns()).toHaveLength(12);

    const [
      nameColumn,
      emailColumn,
      lastAccessDateColumn,
      institutionColumn,
      statusColumn,
      classNameColumn,
      dateColumn,
      progressColumn,
      examReadyColumn,
      lastExamDateColumn,
      eppDaysLeftColumn,
      actionsColumn,
    ] = getColumns();

    expect(nameColumn).toHaveProperty('Header', 'Student');
    expect(nameColumn).toHaveProperty('accessor', 'learnerName');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'learnerEmail');

    expect(lastAccessDateColumn).toHaveProperty('Header', 'Last Login');
    expect(lastAccessDateColumn).toHaveProperty('accessor', 'lastAccess');

    expect(institutionColumn).toHaveProperty('Header', 'Institution');
    expect(institutionColumn).toHaveProperty('accessor', 'institutionName');

    expect(statusColumn).toHaveProperty('Header', 'Status');
    expect(statusColumn).toHaveProperty('accessor', 'status');

    expect(classNameColumn).toHaveProperty('Header', 'Class Name');
    expect(classNameColumn).toHaveProperty('accessor', 'className');

    expect(dateColumn).toHaveProperty('Header', 'Start - End Date');
    expect(dateColumn).toHaveProperty('accessor', 'startDate');

    expect(progressColumn).toHaveProperty('Header', 'Current Grade');
    expect(progressColumn).toHaveProperty('accessor', 'completePercentage');

    expect(examReadyColumn).toHaveProperty('Header', 'Exam Ready');
    expect(examReadyColumn).toHaveProperty('accessor', 'examReady');

    expect(lastExamDateColumn).toHaveProperty('Header', 'Last exam date');
    expect(lastExamDateColumn).toHaveProperty('accessor', 'examReady.lastExamDate');

    expect(eppDaysLeftColumn).toHaveProperty('accessor', 'examReady.eppDaysLeft');

    expect(actionsColumn).toHaveProperty('Header', '');
    expect(actionsColumn).toHaveProperty('accessor', 'classId');
    expect(actionsColumn).toHaveProperty('disableSortBy', true);
  });

  test('renders Student column with correct link', () => {
    const StudentCell = () => getColumns()[0].Cell({
      row: {
        values: { learnerName: 'Test User' },
        original: { learnerEmail: 'testuser@example.com' },
      },
    });

    const component = renderWithProviders(
      <Route path="/students/" element={<StudentCell />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/students/?institutionId=1'],
      },
    );

    const link = component.getByText('Test User');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toContain('/students/testuser%40example.com');
    expect(link.getAttribute('href')).toContain('previous=students');
  });

  test('renders Email column with mailto link', () => {
    const EmailCell = () => getColumns()[1].Cell({
      row: {
        values: { learnerEmail: 'testuser@example.com' },
      },
    });

    const component = renderWithProviders(<EmailCell />, { preloadedState: mockStore });

    const link = component.getByText('testuser@example.com');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'mailto:testuser@example.com');
  });

  test('renders Last access date formatted', () => {
    const LastAccessCell = () => getColumns()[2].Cell({
      row: { original: { lastAccess: '2024-03-15T10:00:00Z', status: 'Active' } },
    });

    const { getByText } = renderWithProviders(<LastAccessCell />, { preloadedState: mockStore });

    expect(getByText('03/15/24')).toBeInTheDocument();
  });

  test('renders Last access date as -- when enrollment is pending', () => {
    const LastAccessCell = () => getColumns()[2].Cell({
      row: { original: { lastAccess: '2024-03-15T10:00:00Z', status: 'pending' } },
    });

    const { getByText } = renderWithProviders(<LastAccessCell />, { preloadedState: mockStore });

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders Last access date as -- when null', () => {
    const LastAccessCell = () => getColumns()[2].Cell({
      row: { original: { lastAccess: null, status: 'Active' } },
    });

    const { getByText } = renderWithProviders(<LastAccessCell />, { preloadedState: mockStore });

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders Status column with correct badge', () => {
    const StatusCell = () => getColumns()[4].Cell({
      row: {
        values: { status: 'Active' },
      },
    });

    const component = renderWithProviders(<StatusCell />, { preloadedState: mockStore });

    const badge = component.getByText('Active');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-capitalize');
  });

  test('renders Class Name column with correct link', () => {
    const ClassNameCell = () => getColumns()[5].Cell({
      row: {
        values: { className: 'test ccx1' },
        original: { classId: 'ccx-v1:demo+demo1+2020+ccx@3' },
      },
    });

    const component = renderWithProviders(
      <Route path="/students/" element={<ClassNameCell />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/students/?institutionId=1'],
      },
    );

    const link = component.getByText('test ccx1');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toContain('/classes/ccx-v1:demo+demo1+2020+ccx@3');
    expect(link.getAttribute('href')).toContain('previous=students');
  });

  test('renders Start - End Date column with formatted dates', () => {
    const DateCell = () => getColumns()[6].Cell({
      row: {
        original: {
          startDate: '2024-02-13T17:42:22Z',
          endDate: '2024-12-31T23:59:59Z',
        },
      },
    });

    const component = renderWithProviders(<DateCell />, { preloadedState: mockStore });

    expect(component.container.textContent).toContain('02/13/24 - 12/31/24');
  });

  test('renders Start - End Date column with empty dates', () => {
    const DateCell = () => getColumns()[6].Cell({
      row: {
        original: {
          startDate: null,
          endDate: null,
        },
      },
    });

    const component = renderWithProviders(<DateCell />, { preloadedState: mockStore });

    expect(component.container.textContent).toBe(' - ');
  });

  test('renders Progress column with percentage text', () => {
    const ProgressCell = () => getColumns()[7].Cell({
      row: {
        values: { completePercentage: 75.5 },
      },
    });

    const { getByText } = renderWithProviders(<ProgressCell />, { preloadedState: mockStore });

    expect(getByText('75%')).toBeInTheDocument();
  });

  test('renders Exam Ready column with ProgressSteps', () => {
    const ExamReadyCell = () => getColumns()[8].Cell({
      row: {
        values: {
          examReady: {
            status: 'Complete',
          },
        },
      },
    });

    const component = renderWithProviders(<ExamReadyCell />, { preloadedState: mockStore });

    expect(component.container.firstChild).toBeInTheDocument();
  });

  test('renders Last exam date with formatted date', () => {
    const LastExamDateCell = () => getColumns()[9].Cell({
      row: {
        values: {
          examReady: {
            lastExamDate: '2024-03-15T10:00:00Z',
          },
        },
      },
    });

    const component = renderWithProviders(<LastExamDateCell />, { preloadedState: mockStore });

    expect(component.getByText('03/15/24')).toBeInTheDocument();
  });

  test('renders Last exam date with placeholder when null', () => {
    const LastExamDateCell = () => getColumns()[9].Cell({
      row: {
        values: {
          examReady: {
            lastExamDate: null,
          },
        },
      },
    });

    const component = renderWithProviders(<LastExamDateCell />, { preloadedState: mockStore });

    expect(component.getByText('--')).toBeInTheDocument();
  });

  test('renders EPP days left header with tooltip', () => {
    const HeaderComponent = () => {
      const columns = getColumns();
      const { Header } = columns[10];
      return <Header />;
    };

    const component = renderWithProviders(<HeaderComponent />, { preloadedState: mockStore });

    expect(component.getByText('Epp days left')).toBeInTheDocument();
    expect(component.container.querySelector('.fa-circle-info')).toBeInTheDocument();
  });

  test('renders EPP days left value', () => {
    const EppDaysLeftCell = () => getColumns()[10].Cell({
      row: {
        values: {
          examReady: {
            eppDaysLeft: 45,
          },
        },
      },
    });

    const component = renderWithProviders(<EppDaysLeftCell />, { preloadedState: mockStore });

    expect(component.getByText('45')).toBeInTheDocument();
  });

  test('renders EPP days left with placeholder when null', () => {
    const EppDaysLeftCell = () => getColumns()[10].Cell({
      row: {
        values: {
          examReady: {
            eppDaysLeft: null,
          },
        },
      },
    });

    const component = renderWithProviders(<EppDaysLeftCell />, { preloadedState: mockStore });

    expect(component.getByText('--')).toBeInTheDocument();
  });

  test('shows menu dropdown with View progress link', () => {
    const ActionColumn = () => getColumns()[11].Cell({
      row: {
        values: {
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
        },
        original: {
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
          userId: 'user123',
          status: 'Active',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(
      <Route path="/students/" element={<ActionColumn />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/students/'],
      },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);

    const viewProgressLink = component.getByText('View progress');
    expect(viewProgressLink).toBeInTheDocument();
    expect(viewProgressLink).toHaveAttribute('target', '_blank');
  });

  test('shows DeleteEnrollment option when hasEnrollmentPrivilege is true and status is not expired', () => {
    const ActionColumn = () => getColumns({ hasEnrollmentPrivilege: true })[11].Cell({
      row: {
        values: {
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
        },
        original: {
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
          userId: 'user123',
          status: 'Active',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(
      <Route path="/students/" element={<ActionColumn />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/students/'],
      },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('does not show DeleteEnrollment option when status is expired', () => {
    const ActionColumn = () => getColumns({ hasEnrollmentPrivilege: true })[11].Cell({
      row: {
        values: {
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
        },
        original: {
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
          userId: 'user123',
          status: 'Expired',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(
      <Route path="/students/" element={<ActionColumn />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/students/'],
      },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('does not show DeleteEnrollment option when hasEnrollmentPrivilege is false', () => {
    const ActionColumn = () => getColumns({ hasEnrollmentPrivilege: false })[11].Cell({
      row: {
        values: {
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
        },
        original: {
          classId: 'ccx-v1:demo+demo1+2020+ccx@3',
          userId: 'user123',
          status: 'Active',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(
      <Route path="/students/" element={<ActionColumn />} />,
      {
        preloadedState: mockStore,
        initialEntries: ['/students/'],
      },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);

    expect(component.getByText('View progress')).toBeInTheDocument();
  });
});
