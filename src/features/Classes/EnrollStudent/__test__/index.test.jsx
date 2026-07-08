import React from 'react';
import { renderWithProviders } from 'test-utils';
import { fireEvent, waitFor } from '@testing-library/react';
import * as router from 'react-router-dom';

import EnrollStudent from 'features/Classes/EnrollStudent';

import * as api from 'features/Classes/data/api';
import { fetchStudentsData } from 'features/Students/data';
import { fetchAllClassesData } from 'features/Common/data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('features/Classes/data/api', () => ({
  handleEnrollments: jest.fn(),
  getMessages: jest.fn(),
}));

jest.mock('features/Students/data', () => ({
  ...jest.requireActual('features/Students/data'),
  fetchStudentsData: jest.fn(() => ({ type: 'FETCH_STUDENTS' })),
}));

jest.mock('features/Common/data', () => ({
  ...jest.requireActual('features/Common/data'),
  fetchAllClassesData: jest.fn(() => ({ type: 'FETCH_CLASSES' })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@openedx/paragon', () => {
  /* eslint-disable react/prop-types */
  const actual = jest.requireActual('@openedx/paragon');

  const Toast = ({ children, show, ...props }) => (show ? <div {...props}>{children}</div> : null);

  const Spinner = () => <div data-testid="spinner" />;

  return {
    ...actual,
    Toast,
    Spinner,
  };
});

describe('EnrollStudent', () => {
  const mockState = {
    main: {
      username: 'demo_instructor',
      institution: { id: 456, name: 'Demo Institution' },
    },
  };

  beforeEach(() => {
    router.useParams.mockReturnValue({ classId: 'ccx1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render with correct elements', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <EnrollStudent isOpen onClose={() => {}} className="demo class" />,
      { preloadedState: mockState },
    );

    expect(getByText('Invite student to enroll')).toBeInTheDocument();
    expect(getByText('Class: demo class')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter email of the student to enroll')).toBeInTheDocument();
    expect(getByText('Send invite')).toBeInTheDocument();
  });

  test('Should handle form submission and shows success toast', async () => {
    const onCloseMock = jest.fn();

    api.handleEnrollments.mockResolvedValue({
      data: {
        results: [{
          identifier: 'test@example.com',
        }],
      },
    });

    api.getMessages.mockResolvedValue({
      data: {
        results: [],
      },
    });

    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} className="demo class" />,
      { preloadedState: mockState },
    );

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId('toast-message')).toHaveTextContent(/Successfully enrolled and sent email to the following user:\s*test@example\.com/);
    });

    expect(api.handleEnrollments).toHaveBeenCalledTimes(1);
    expect(api.getMessages).toHaveBeenCalledTimes(1);
    expect(fetchStudentsData).toHaveBeenCalledWith(
      'demo_instructor',
      expect.objectContaining({
        class_name: 'demo class',
        institution_id: 456,
        limit: true,
        page: 1,
      }),
    );
    expect(fetchAllClassesData).toHaveBeenCalledWith(
      'demo_instructor',
      { class_id: 'ccx1', institution_id: 456 },
    );
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('Should handle form submission and show error toast', async () => {
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
      { preloadedState: mockState },
    );

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId('toast-message')).toHaveTextContent('Enrollment limit reached');
    });

    expect(api.handleEnrollments).toHaveBeenCalledTimes(1);
    expect(api.getMessages).toHaveBeenCalledTimes(1);
    expect(fetchStudentsData).not.toHaveBeenCalled();
    expect(fetchAllClassesData).not.toHaveBeenCalled();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('Should handle form submission and show error toast for invalid email', async () => {
    const onCloseMock = jest.fn();

    api.handleEnrollments.mockResolvedValue({
      data: {
        results: [{
          identifier: 'test@example.com',
          invalidIdentifier: true,
        }],
      },
    });

    api.getMessages.mockResolvedValue({
      data: {
        results: [],
      },
    });

    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <EnrollStudent isOpen onClose={onCloseMock} className="demo class" />,
      { preloadedState: mockState },
    );

    const emailInput = getByPlaceholderText('Enter email of the student to enroll');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send invite');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId('toast-message')).toHaveTextContent(/The following email adress is invalid:\s*test@example\.com/);
    });

    expect(api.handleEnrollments).toHaveBeenCalledTimes(1);
    expect(api.getMessages).toHaveBeenCalledTimes(1);
    expect(fetchStudentsData).toHaveBeenCalledWith(
      'demo_instructor',
      expect.objectContaining({
        class_name: 'demo class',
        institution_id: 456,
        limit: true,
        page: 1,
      }),
    );
    expect(fetchAllClassesData).toHaveBeenCalledWith(
      'demo_instructor',
      { class_id: 'ccx1', institution_id: 456 },
    );
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
