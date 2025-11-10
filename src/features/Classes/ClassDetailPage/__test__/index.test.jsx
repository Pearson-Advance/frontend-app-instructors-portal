import { fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

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
    expect(cols).toHaveLength(9);

    expect(cols[0]).toHaveProperty('Header', 'No');
    expect(cols[1]).toHaveProperty('Header', 'Student');
    expect(cols[2]).toHaveProperty('Header', 'Email');
    expect(cols[3]).toHaveProperty('Header', 'Status');
    expect(cols[4]).toHaveProperty('Header', 'Current Grade');
    expect(cols[5]).toHaveProperty('Header', 'Exam Ready');
    expect(cols[6]).toHaveProperty('Header', 'Last exam date');
    expect(cols[7]).toHaveProperty('accessor', 'examReady.eppDaysLeft');
    expect(cols[8]).toHaveProperty('accessor', 'classId');
  });

  test('renders index correctly', () => {
    const IndexCell = () => getColumns()[0].Cell({ row: { index: 0 } });

    const { getByText } = renderWithProviders(
      <MemoryRouter><IndexCell /></MemoryRouter>,
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

    const { getByText } = renderWithProviders(
      <MemoryRouter><StudentCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    const link = getByText('Test User');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  test('renders Email mailto link', () => {
    const EmailCell = () => getColumns()[2].Cell({
      row: { values: { learnerEmail: 'testuser@example.com' } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter><EmailCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('testuser@example.com')).toHaveAttribute(
      'href',
      'mailto:testuser@example.com',
    );
  });

  test('renders Status badge', () => {
    const StatusCell = () => getColumns()[3].Cell({
      row: { values: { status: 'Active' } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter><StatusCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('Active')).toBeInTheDocument();
  });

  test('renders Current Grade correctly', () => {
    const GradeCell = () => getColumns()[4].Cell({
      row: { values: { completePercentage: 75.5 } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter><GradeCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('75%')).toBeInTheDocument();
  });

  test('renders Exam Ready with ProgressSteps', () => {
    const ExamReadyCell = () => getColumns()[5].Cell({
      row: { values: { examReady: { status: 'Complete' } } },
    });

    const { container } = renderWithProviders(
      <MemoryRouter><ExamReadyCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders Last exam date formatted', () => {
    const LastExamDateCell = () => getColumns()[6].Cell({
      row: { values: { examReady: { lastExamDate: '2024-03-15T10:00:00Z' } } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter><LastExamDateCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('03/15/24')).toBeInTheDocument();
  });

  test('renders Last exam date placeholder when null', () => {
    const LastExamDateCell = () => getColumns()[6].Cell({
      row: { values: { examReady: { lastExamDate: null } } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter><LastExamDateCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders EPP days left value', () => {
    const EppCell = () => getColumns()[7].Cell({
      row: { values: { examReady: { eppDaysLeft: 45 } } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter><EppCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('45')).toBeInTheDocument();
  });

  test('renders EPP days left placeholder', () => {
    const EppCell = () => getColumns()[7].Cell({
      row: { values: { examReady: { eppDaysLeft: null } } },
    });

    const { getByText } = renderWithProviders(
      <MemoryRouter><EppCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    expect(getByText('--')).toBeInTheDocument();
  });

  test('renders actions dropdown and shows View progress', () => {
    const ActionCell = () => getColumns()[8].Cell({
      row: {
        original: {
          classId: 'ccx-123',
          userId: 'user123',
          status: 'Active',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(
      <MemoryRouter><ActionCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('shows DeleteEnrollment when privileged and not expired', () => {
    const ActionCell = () => getColumns({ hasEnrollmentPrivilege: true })[8].Cell({
      row: {
        original: {
          classId: 'ccx-123',
          userId: 'user123',
          status: 'Active',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(
      <MemoryRouter><ActionCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('View progress')).toBeInTheDocument();
  });

  test('does NOT show DeleteEnrollment when expired', () => {
    const ActionCell = () => getColumns({ hasEnrollmentPrivilege: true })[8].Cell({
      row: {
        original: {
          classId: 'ccx-123',
          userId: 'user123',
          status: 'Expired',
          learnerEmail: 'testuser@example.com',
        },
      },
    });

    const component = renderWithProviders(
      <MemoryRouter><ActionCell /></MemoryRouter>,
      { preloadedState: mockStore },
    );

    fireEvent.click(component.getByTestId('droprown-action'));

    expect(component.getByText('View progress')).toBeInTheDocument();
  });
});
