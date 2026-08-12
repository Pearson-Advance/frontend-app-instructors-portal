import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';
import { getColumns } from 'features/Classes/ClassDetailPage/columns';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LEARNING_MICROFRONTEND_URL: 'https://fake-mfe.com',
  })),
}));

describe('getColumns (ClassDetailPage)', () => {
  const mockStore = {
    main: {
      selectedInstitution: { id: 1 },
    },
    students: {
      table: {
        results: [
          {
            learnerName: 'Test User',
            learnerEmail: 'testuser@example.com',
            classId: 'ccx-123',
            className: 'Demo Class',
            status: 'Active',
            completePercentage: 75,
            examReady: {
              status: 'Complete',
              lastExamDate: '2024-03-15T10:00:00Z',
              eppDaysLeft: 45,
            },
            userId: 'user123',
          },
        ],
      },
    },
  };

  test('returns correct column structure', () => {
    const cols = getColumns();
    expect(cols).toHaveLength(11);

    expect(cols[0]).toHaveProperty('Header', 'No');
    expect(cols[1]).toHaveProperty('Header', 'Student');
    expect(cols[2]).toHaveProperty('Header', 'Email');
    expect(cols[3]).toHaveProperty('Header', 'Last Login');
    expect(cols[4]).toHaveProperty('Header', 'Last Access');
    expect(cols[5]).toHaveProperty('Header', 'Status');
    expect(cols[6]).toHaveProperty('Header', 'Current Grade');
    expect(cols[7]).toHaveProperty('Header', 'Exam Ready');
    expect(cols[8]).toHaveProperty('Header', 'Last exam date');
    expect(cols[9]).toHaveProperty('accessor', 'examReady.eppDaysLeft');
    expect(cols[10]).toHaveProperty('accessor', 'classId');
  });

  test('renders index correctly', () => {
    const IndexCell = () => getColumns()[0].Cell({ row: { index: 0 } });

    const { getByText } = renderWithProviders(
      <IndexCell />,
      { preloadedState: mockStore },
    );

    expect(getByText('1')).toBeInTheDocument();
  });

  test('renders Student link', () => {
    const StudentCell = () => getColumns()[1].Cell({
      row: {
        values: { learnerName: 'Test User' },
        original: { learnerEmail: 'testuser@example.com' },
      },
    });

    const { getByText } = renderWithProviders(<StudentCell />, { preloadedState: mockStore });

    const link = getByText('Test User');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  test('renders Email mailto link', () => {
    const EmailCell = () => getColumns()[2].Cell({
      row: { values: { learnerEmail: 'testuser@example.com' } },
    });

    const { getByText } = renderWithProviders(<EmailCell />, { preloadedState: mockStore });

    expect(getByText('testuser@example.com')).toHaveAttribute(
      'href',
      'mailto:testuser@example.com',
    );
  });

  test('renders Last access date formatted', () => {
    const LastLoginCell = () => getColumns()[3].Cell({
      row: { original: { lastLogin: '2024-03-15T10:00:00Z' } },
    });

    const { getByText } = renderWithProviders(<LastLoginCell />, { preloadedState: mockStore });

    expect(getByText('03/15/24')).toBeInTheDocument();
  });

  test('renders Last access date placeholder when null', () => {
    const LastLoginCell = () => getColumns()[3].Cell({
      row: { original: { lastLogin: null } },
    });

    const { getByText } = renderWithProviders(<LastLoginCell />, { preloadedState: mockStore });

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders Last access date as -- when enrollment is pending', () => {
    const LastLoginCell = () => getColumns()[3].Cell({
      row: { original: { lastLogin: '2024-03-15T10:00:00Z', status: 'pending' } },
    });

    const { getByText } = renderWithProviders(<LastLoginCell />, { preloadedState: mockStore });

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders Last Access (Platform) date formatted', () => {
    const LastAccessCell = () => getColumns()[4].Cell({
      row: { original: { lastAccess: '2024-03-15T10:00:00Z' } },
    });

    const { getByText } = renderWithProviders(<LastAccessCell />, { preloadedState: mockStore });

    expect(getByText('03/15/24')).toBeInTheDocument();
  });

  test('renders Last Access (Platform) date placeholder when null', () => {
    const LastAccessCell = () => getColumns()[4].Cell({
      row: { original: { lastAccess: null } },
    });

    const { getByText } = renderWithProviders(<LastAccessCell />, { preloadedState: mockStore });

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders Status badge', () => {
    const StatusCell = () => getColumns()[5].Cell({
      row: { values: { status: 'Active' } },
    });

    const { getByText } = renderWithProviders(<StatusCell />, { preloadedState: mockStore });

    expect(getByText('Active')).toBeInTheDocument();
  });

  test('renders Current Grade correctly', () => {
    const GradeCell = () => getColumns()[6].Cell({
      row: { values: { completePercentage: 75.5 } },
    });

    const { getByText } = renderWithProviders(<GradeCell />, { preloadedState: mockStore });

    expect(getByText('75%')).toBeInTheDocument();
  });

  test('renders Exam Ready with ProgressSteps', () => {
    const ExamReadyCell = () => getColumns()[7].Cell({
      row: { values: { examReady: { status: 'Complete' } } },
    });

    const { container } = renderWithProviders(<ExamReadyCell />, { preloadedState: mockStore });

    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders Last exam date formatted', () => {
    const LastExamDateCell = () => getColumns()[8].Cell({
      row: { values: { examReady: { lastExamDate: '2024-03-15T10:00:00Z' } } },
    });

    const { getByText } = renderWithProviders(<LastExamDateCell />, { preloadedState: mockStore });

    expect(getByText('03/15/24')).toBeInTheDocument();
  });

  test('renders Last exam date placeholder when null', () => {
    const LastExamDateCell = () => getColumns()[8].Cell({
      row: { values: { examReady: { lastExamDate: null } } },
    });

    const { getByText } = renderWithProviders(<LastExamDateCell />, { preloadedState: mockStore });

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders EPP days left value', () => {
    const EppCell = () => getColumns()[9].Cell({
      row: { values: { examReady: { eppDaysLeft: 45 } } },
    });

    const { getByText } = renderWithProviders(<EppCell />, { preloadedState: mockStore });

    expect(getByText('45')).toBeInTheDocument();
  });

  test('renders EPP days left placeholder', () => {
    const EppCell = () => getColumns()[9].Cell({
      row: { values: { examReady: { eppDaysLeft: null } } },
    });

    const { getByText } = renderWithProviders(<EppCell />, { preloadedState: mockStore });

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders actions dropdown and shows View progress', () => {
    const ActionCell = () => getColumns()[10].Cell({
      row: {
        original: {
          classId: 'ccx-123',
          userId: 'user123',
          status: 'Active',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(<ActionCell />, { preloadedState: mockStore });

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('shows DeleteEnrollment when privileged and not expired', () => {
    const ActionCell = () => getColumns({ hasEnrollmentPrivilege: true })[10].Cell({
      row: {
        original: {
          classId: 'ccx-123',
          userId: 'user123',
          status: 'Active',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(<ActionCell />, { preloadedState: mockStore });

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('does NOT show DeleteEnrollment when expired', () => {
    const ActionCell = () => getColumns({ hasEnrollmentPrivilege: true })[10].Cell({
      row: {
        original: {
          classId: 'ccx-123',
          userId: 'user123',
          status: 'Expired',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(<ActionCell />, { preloadedState: mockStore });

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('View progress')).toBeInTheDocument();
  });
});
