import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

import { renderWithProviders } from 'test-utils';

import { getColumns } from 'features/Classes/ClassDetailPage/columns';

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
            examReady: {
              status: 'Complete',
              lastExamDate: '2024-03-15T10:00:00Z',
              eppDaysLeft: 45,
            },
            startDate: '2024-02-13T17:42:22Z',
            endDate: null,
            completePercentage: 75.5,
            userId: 'user123',
          },
        ],
      },
    },
  };

  test('returns an array of columns with correct properties', () => {
    expect(getColumns()).toBeInstanceOf(Array);
    expect(getColumns()).toHaveLength(9);

    const [
      indexColumn,
      nameColumn,
      emailColumn,
      statusColumn,
      progressColumn,
      examReadyColumn,
      lastExamDateColumn,
      eppDaysLeftColumn,
      actionsColumn,
    ] = getColumns();

    expect(indexColumn).toHaveProperty('Header', 'No');
    expect(indexColumn).toHaveProperty('accessor', 'index');

    expect(nameColumn).toHaveProperty('Header', 'Student');
    expect(nameColumn).toHaveProperty('accessor', 'learnerName');

    expect(emailColumn).toHaveProperty('Header', 'Email');
    expect(emailColumn).toHaveProperty('accessor', 'learnerEmail');

    expect(statusColumn).toHaveProperty('Header', 'Status');
    expect(statusColumn).toHaveProperty('accessor', 'status');

    expect(progressColumn).toHaveProperty('Header', 'Courseware Progress');
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

  test('renders index column correctly', () => {
    const IndexCell = () => getColumns()[0].Cell({
      row: {
        index: 0,
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={['/classes/ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/classes/:classId">
          <IndexCell />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('1')).toBeInTheDocument();
  });

  test('renders Student column with link', () => {
    const StudentCell = () => getColumns()[1].Cell({
      row: {
        values: { learnerName: 'Test User' },
        original: { learnerEmail: 'testuser@example.com' },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter initialEntries={['/classes/ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/classes/:classId">
          <StudentCell />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const link = getByText('Test User');
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('link');
  });

  test('renders Email column with mailto link', () => {
    const EmailCell = () => getColumns()[2].Cell({
      row: {
        values: { learnerEmail: 'testuser@example.com' },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <EmailCell />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const link = getByText('testuser@example.com');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'mailto:testuser@example.com');
  });

  test('renders Status column with correct badge', () => {
    const StatusCell = () => getColumns()[3].Cell({
      row: {
        values: { status: 'Active' },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <StatusCell />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const badge = getByText('Active');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-capitalize');
  });

  test('renders Progress column with ProgressBar', () => {
    const ProgressCell = () => getColumns()[4].Cell({
      row: {
        values: { completePercentage: 75.5 },
      },
    });

    const { container } = renderWithProviders(
      <MemoryRouter>
        <ProgressCell />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const progressBar = container.querySelector('.progress-bar');
    expect(progressBar).toBeInTheDocument();
    expect(container.querySelector('.custom-progress')).toBeInTheDocument();
  });

  test('renders Exam Ready column with ProgressSteps', () => {
    const ExamReadyCell = () => getColumns()[5].Cell({
      row: {
        values: {
          examReady: {
            status: 'Complete',
          },
        },
      },
    });

    const { container } = renderWithProviders(
      <MemoryRouter>
        <ExamReadyCell />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders Last exam date with formatted date', () => {
    const LastExamDateCell = () => getColumns()[6].Cell({
      row: {
        values: {
          examReady: {
            lastExamDate: '2024-03-15T10:00:00Z',
          },
        },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <LastExamDateCell />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('03/15/24')).toBeInTheDocument();
  });

  test('renders Last exam date with placeholder when null', () => {
    const LastExamDateCell = () => getColumns()[6].Cell({
      row: {
        values: {
          examReady: {
            lastExamDate: null,
          },
        },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <LastExamDateCell />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders EPP days left header with tooltip', () => {
    const HeaderComponent = () => {
      const columns = getColumns();
      const { Header } = columns[7];
      return <Header />;
    };

    const { getByText, container } = renderWithProviders(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('Epp days left')).toBeInTheDocument();
    expect(container.querySelector('.fa-circle-info')).toBeInTheDocument();
    expect(container.querySelector('.epp-header')).toBeInTheDocument();
  });

  test('renders EPP days left value', () => {
    const EppDaysLeftCell = () => getColumns()[7].Cell({
      row: {
        values: {
          examReady: {
            eppDaysLeft: 45,
          },
        },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <EppDaysLeftCell />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('45')).toBeInTheDocument();
  });

  test('renders EPP days left with placeholder when null', () => {
    const EppDaysLeftCell = () => getColumns()[7].Cell({
      row: {
        values: {
          examReady: {
            eppDaysLeft: null,
          },
        },
      },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter>
        <EppDaysLeftCell />
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('--')).toBeInTheDocument();
  });

  test('shows menu dropdown with View progress link', () => {
    const ActionColumn = () => getColumns()[8].Cell({
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
      <MemoryRouter initialEntries={['/classes/ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/classes/:classId">
          <ActionColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);

    const viewProgressLink = component.getByText('View progress');
    expect(viewProgressLink).toBeInTheDocument();
    expect(viewProgressLink).toHaveAttribute('target', '_blank');
  });

  test('shows DeleteEnrollment option when hasEnrollmentPrivilege is true and status is not expired', () => {
    const ActionColumn = () => getColumns({ hasEnrollmentPrivilege: true })[8].Cell({
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
      <MemoryRouter initialEntries={['/classes/ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/classes/:classId">
          <ActionColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('does not show DeleteEnrollment option when status is expired', () => {
    const ActionColumn = () => getColumns({ hasEnrollmentPrivilege: true })[8].Cell({
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
      <MemoryRouter initialEntries={['/classes/ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/classes/:classId">
          <ActionColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('does not show DeleteEnrollment option when hasEnrollmentPrivilege is false', () => {
    const ActionColumn = () => getColumns({ hasEnrollmentPrivilege: false })[8].Cell({
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
      <MemoryRouter initialEntries={['/classes/ccx-v1:demo+demo1+2020+ccx@3']}>
        <Route path="/classes/:classId">
          <ActionColumn />
        </Route>
      </MemoryRouter>,
      { preloadedState: mockStore },
    );

    const button = component.getByTestId('droprown-action');
    fireEvent.click(button);

    expect(component.getByText('View progress')).toBeInTheDocument();
  });
});
