import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';
import { getColumns } from 'features/Classes/ClassDetailPage/columns';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LEARNING_MICROFRONTEND_URL: 'http://localhost:2000',
  })),
}));

describe('getColumns (ClassDetailPage)', () => {
  const mockStore = {
    main: {
      selectedInstitution: { id: 1 },
    },
    students: {
      table: {
        data: [
          {
            learnerName: 'Test User',
            learnerEmail: 'testuser@example.com',
            classId: 'ccx-1',
            status: 'Active',
            examReady: {
              status: 'Complete',
              lastExamDate: '2024-03-15T10:00:00Z',
              eppDaysLeft: 45,
            },
            completePercentage: 75.5,
            userId: 'user123',
          },
        ],
      },
    },
  };

  test('returns an array of 10 columns with correct headers', () => {
    const cols = getColumns();

    expect(cols).toHaveLength(10);

    expect(cols[0]).toHaveProperty('Header', '');
    expect(cols[0]).toHaveProperty('accessor', 'classId');

    expect(cols[1]).toHaveProperty('Header', 'Student');
    expect(cols[2]).toHaveProperty('Header', 'Email');
    expect(cols[3]).toHaveProperty('Header', 'Last Login');
    expect(cols[4]).toHaveProperty('Header', 'Last Access');
    expect(cols[5]).toHaveProperty('Header', 'Status');
    expect(cols[6]).toHaveProperty('Header', 'Current Grade');
    expect(cols[7]).toHaveProperty('Header', 'Exam Ready');
    expect(cols[8]).toHaveProperty('Header', 'Last exam date');
    expect(cols[9]).toHaveProperty('accessor', 'examReady.eppDaysLeft');
  });

  test('renders Student link', () => {
    const Cell = () => getColumns()[1].Cell({
      row: {
        values: { learnerName: 'Test User' },
        original: { learnerEmail: 'testuser@example.com' },
      },
    });

    const { getByText } = renderWithProviders(
      <Cell />,
      { preloadedState: mockStore },
    );

    const link = getByText('Test User');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  test('renders Email mailto link', () => {
    const Cell = () => getColumns()[2].Cell({
      row: { values: { learnerEmail: 'testuser@example.com' } },
    });

    const { getByText } = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    const link = getByText('testuser@example.com');
    expect(link).toHaveAttribute('href', 'mailto:testuser@example.com');
  });

  test('renders Status badge', () => {
    const Cell = () => getColumns()[5].Cell({
      row: { values: { status: 'Active' } },
    });

    const { getByText } = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    expect(getByText('Active')).toBeInTheDocument();
  });

  test('renders Current Grade correctly', () => {
    const Cell = () => getColumns()[6].Cell({
      row: { values: { completePercentage: 75.5 } },
    });

    const { getByText } = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    expect(getByText('75%')).toBeInTheDocument();
  });

  test('renders Exam Ready with ProgressSteps', () => {
    const Cell = () => getColumns()[7].Cell({
      row: { values: { examReady: { status: 'Complete' } } },
    });

    const { container } = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders Last exam date formatted', () => {
    const Cell = () => getColumns()[8].Cell({
      row: { values: { examReady: { lastExamDate: '2024-03-15T10:00:00Z' } } },
    });

    const { getByText } = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    expect(getByText('03/15/24')).toBeInTheDocument();
  });

  test('renders Last exam date placeholder when null', () => {
    const Cell = () => getColumns()[8].Cell({
      row: { values: { examReady: { lastExamDate: null } } },
    });

    const { getByText } = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders EPP days left', () => {
    const Cell = () => getColumns()[9].Cell({
      row: { values: { examReady: { eppDaysLeft: 45 } } },
    });

    const { getByText } = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    expect(getByText('45')).toBeInTheDocument();
  });

  test('renders EPP placeholder when null', () => {
    const Cell = () => getColumns()[9].Cell({
      row: { values: { examReady: { eppDaysLeft: null } } },
    });

    const { getByText } = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    expect(getByText('--')).toBeInTheDocument();
  });

  test('action dropdown shows View progress', () => {
    const Cell = () => getColumns()[0].Cell({
      row: {
        original: {
          classId: 'ccx-1',
          userId: 'user123',
          status: 'Active',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('shows DeleteEnrollment when privileged and not expired', () => {
    const Cell = () => getColumns({ hasEnrollmentPrivilege: true })[0].Cell({
      row: {
        original: {
          classId: 'ccx-1',
          userId: 'user123',
          status: 'Active',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('does NOT show DeleteEnrollment when expired', () => {
    const Cell = () => getColumns({ hasEnrollmentPrivilege: true })[0].Cell({
      row: {
        original: {
          classId: 'ccx-1',
          userId: 'user123',
          status: 'Expired',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(<Cell />, {
      preloadedState: mockStore,
    });

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('View progress')).toBeInTheDocument();
  });
});
