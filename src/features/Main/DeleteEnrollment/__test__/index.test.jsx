/* eslint-disable react/prop-types */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';
import { deleteEnrollment } from 'features/Main/data/api';
import DeleteEnrollment from 'features/Main/DeleteEnrollment';

/* =========================
   MOCK: react-paragon-topaz
   ========================= */
jest.mock('react-paragon-topaz', () => ({
  UNENROLL_ERROR_MESSAGE: 'You have exceeded the unenrollment threshold.',

  ConfirmationModal: ({
    isOpen,
    title,
    children,
    message,
    confirmText = 'Proceed',
    cancelText = 'Dismiss',
    onConfirm,
    onClose,
  }) => (isOpen ? (
    <div data-testid="confirmation-modal">
      <h1>{title}</h1>
      <div>
        {message}
        {children}
      </div>
      <button type="button" onClick={onConfirm}>{confirmText}</button>
      <button type="button" onClick={onClose}>{cancelText}</button>
    </div>
  ) : null),
}));

/* =========================
   MOCK: @openedx/paragon
   ========================= */
jest.mock('@openedx/paragon', () => {
  /* eslint-disable no-shadow, global-require */
  const React = require('react');

  return {
    Dropdown: Object.assign(
      ({ children }) => <div>{children}</div>,
      {
        Item: ({ children, ...props }) => (
          <button type="button" {...props}>{children}</button>
        ),
      },
    ),

    DropdownToggle: ({ children, ...props }) => (
      <button type="button" {...props}>{children}</button>
    ),

    DropdownMenu: ({ children }) => <div>{children}</div>,

    Toast: ({ show, children }) => (show ? (
      <div data-testid="toast-message">{children}</div>
    ) : null),

    useToggle: (initial = false) => {
      const [value, setValue] = React.useState(initial);
      return [
        value,
        () => setValue(true),
        () => setValue(false),
      ];
    },
  };
});

/* =========================
   MOCK: API
   ========================= */
jest.mock('features/Main/data/api', () => ({
  deleteEnrollment: jest.fn(),
}));

const mockDeleteEnrollment = deleteEnrollment;

/* =========================
   SETUP
   ========================= */
beforeAll(() => {
  const portalRoot = document.createElement('div');
  portalRoot.id = 'paragon-portal-root';
  document.body.appendChild(portalRoot);
});

afterEach(() => {
  jest.clearAllMocks();
});

/* =========================
   HELPERS
   ========================= */
const renderDeleteEnrollment = () => renderWithProviders(
  <DeleteEnrollment
    studentEmail="test@example.com"
    classId="class-id"
  />,
  {
    preloadedState: {
      main: { selectedInstitution: { id: 1 } },
      students: {
        table: { data: [{ learnerEmail: 'test@example.com' }] },
      },
    },
  },
);

const openConfirmationModal = async () => {
  fireEvent.click(await screen.findByTestId('delete-enrollment'));
  await screen.findByTestId('confirmation-modal');
};

/* =========================
   TESTS
   ========================= */
describe('DeleteEnrollment Component', () => {
  test('opens confirmation modal', async () => {
    renderDeleteEnrollment();
    await openConfirmationModal();

    expect(
      screen.getByTestId('confirmation-modal'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /delete enrollment/i }),
    ).toBeInTheDocument();
  });

  test('shows success toast on success', async () => {
    mockDeleteEnrollment.mockResolvedValueOnce({
      data: { results: [{}] },
    });

    renderDeleteEnrollment();
    await openConfirmationModal();

    fireEvent.click(screen.getByText('Proceed'));

    await waitFor(() => expect(
      screen.getByTestId('toast-message'),
    ).toBeInTheDocument());
  });

  test('shows threshold error modal', async () => {
    mockDeleteEnrollment.mockResolvedValueOnce({
      data: { results: [{ error: true }] },
    });

    renderDeleteEnrollment();
    await openConfirmationModal();

    fireEvent.click(screen.getByText('Proceed'));

    expect(
      await screen.findByText(
        'You have exceeded the unenrollment threshold.',
      ),
    ).toBeInTheDocument();
  });

  test('shows generic error modal on exception', async () => {
    mockDeleteEnrollment.mockRejectedValueOnce(new Error('fail'));

    renderDeleteEnrollment();
    await openConfirmationModal();

    fireEvent.click(screen.getByText('Proceed'));

    expect(
      await screen.findByText(/unexpected error occurred/i),
    ).toBeInTheDocument();
  });

  test('dismiss resets modals', async () => {
    mockDeleteEnrollment.mockRejectedValueOnce(new Error('fail'));

    renderDeleteEnrollment();
    await openConfirmationModal();

    fireEvent.click(screen.getByText('Proceed'));
    fireEvent.click(screen.getByText('Dismiss'));

    await waitFor(() => expect(
      screen.queryByTestId('confirmation-modal'),
    ).not.toBeInTheDocument());
  });
});
