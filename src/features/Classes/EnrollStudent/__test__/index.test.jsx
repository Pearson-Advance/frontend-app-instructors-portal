import React from 'react';
import { renderWithProviders } from 'test-utils';
import { fireEvent, waitFor, act } from '@testing-library/react';
import * as router from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import EnrollStudent from 'features/Classes/EnrollStudent';

import * as api from 'features/Classes/data/api';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('features/Classes/data/api', () => ({
  handleEnrollments: jest.fn(),
  getMessages: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/paragon', () => {
  /* eslint-disable react/prop-types */
  const actual = jest.requireActual('@edx/paragon');

  const Toast = ({ children, show }) => (show ? <div data-testid="toast-message">{children}</div> : null);

  const Spinner = () => <div data-testid="spinner" />;

  return {
    ...actual,
    Toast,
    Spinner,
  };
});

describe('EnrollStudent', () => {
  beforeEach(() => {
    router.useParams.mockReturnValue({ classId: 'ccx1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should render with correct elements', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <EnrollStudent isOpen onClose={() => {}} className="demo class" />,
      { preloadedState: {} },
    );

    expect(getByText('Invite student to enroll')).toBeInTheDocument();
    expect(getByText('Class: demo class')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter email of the student to enroll')).toBeInTheDocument();
    expect(getByText('Send invite')).toBeInTheDocument();
  });

  test('Should handle form submission and shows success toast', async () => {
    const onCloseMock = jest.fn();

    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} className="demo class" />,
      { preloadedState: {} },
    );

    const handleEnrollmentsMock = jest.spyOn(api, 'handleEnrollments').mockResolvedValue({
      data: {
        results: [{
          identifier: 'test@example.com',
        }],
      },
    });

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId('toast-message').textContent).toBe('Successfully enrolled and sent email to the following user:\ntest@example.com');
    });

    expect(handleEnrollmentsMock).toHaveBeenCalledTimes(1);
    handleEnrollmentsMock.mockRestore();
  });

  // Review the test
  test.skip('Should handle form submission and show error toast', async () => {
    const onCloseMock = jest.fn();

    api.handleEnrollments.mockResolvedValue({
      data: { results: [] },
    });

    api.getMessages.mockResolvedValue({
      data: {
        results: [{ tags: 'error', message: 'Enrollment limit reached' }],
      },
    });

    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} className="demo class" />,
      { preloadedState: {} },
    );

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId('toast-message')).toHaveTextContent('Enrollment limit reached');
    });

    expect(api.getMessages).toHaveBeenCalledTimes(1);
  });

  // Review test
  test.skip('Should handle form submission and show error toast for invalid email', async () => {
    const onCloseMock = jest.fn();

    api.handleEnrollments.mockResolvedValue({
      data: {
        results: [{
          identifier: 'test@example.com',
          invalidIdentifier: true,
        }],
      },
    });

    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} className="demo class" />,
      { preloadedState: {} },
    );

    const handleEnrollmentsMock = jest.spyOn(api, 'handleEnrollments').mockResolvedValue({
      data: {
        results: [{
          identifier: 'test@example.com',
          invalidIdentifier: true,
        }],
      },
    });

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await act(async () => {
      jest.runOnlyPendingTimers();
      await Promise.resolve();
    });

    expect(getByTestId('toast-message').textContent).toBe('The following email adress is invalid:\ntest@example.com\n');

    expect(handleEnrollmentsMock).toHaveBeenCalledTimes(1);
    handleEnrollmentsMock.mockRestore();
  });
});
