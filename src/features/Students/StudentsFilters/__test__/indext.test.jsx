import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, act } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';
import StudentsFilters from 'features/Students/StudentsFilters';

import { fetchStudentsData } from 'features/Students/data';

jest.mock('features/Students/data', () => {
  const actual = jest.requireActual('features/Students/data');
  return {
    ...actual,
    fetchStudentsData: jest.fn(() => ({ type: 'FETCH_STUDENTS' })),
  };
});

jest.mock('features/Common/data', () => {
  const actual = jest.requireActual('features/Common/data');
  return {
    ...actual,
    fetchAllCourses: jest.fn(() => ({ type: 'FETCH_COURSES' })),
    fetchAllClassesData: jest.fn(() => ({ type: 'FETCH_CLASSES' })),
  };
});

describe('StudentsFilters', () => {
  const mockState = {
    main: {
      username: 'demo_instructor',
      institution: { id: 456, name: 'Demo Institution' },
    },
    common: {
      allCourses: {
        status: 'SUCCEEDED',
        data: [
          { masterCourseName: 'Python 101' },
          { masterCourseName: 'Data Science' },
        ],
      },
      allClasses: {
        status: 'SUCCEEDED',
        data: [
          { className: 'Class A' },
          { className: 'Class B' },
        ],
      },
    },
    students: {
      filters: {},
      table: {
        data: [],
        count: 0,
        num_pages: 0,
        current_page: 1,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all basic fields and buttons disabled initially', () => {
    const { getByPlaceholderText, getAllByText, getByText } = renderWithProviders(<StudentsFilters />, {
      preloadedState: mockState,
    });

    const studentNameElements = getAllByText('Student name');
    expect(studentNameElements.length).toBeGreaterThan(0);

    expect(getByPlaceholderText('Student name')).toBeInTheDocument();

    expect(getByText('Course')).toBeInTheDocument();
    expect(getByText('Class')).toBeInTheDocument();
    expect(getByText('Exam ready')).toBeInTheDocument();

    const resetButton = getByText('Reset');
    const applyButton = getByText('Apply');
    expect(resetButton).toBeDisabled();
    expect(applyButton).toBeDisabled();
  });

  test('enables Apply button when typing a student name and dispatches correct actions', async () => {
    const { getByTestId, getByText, store } = renderWithProviders(<StudentsFilters />, {
      preloadedState: mockState,
    });

    const input = getByTestId('studentInput');
    const applyButton = getByText('Apply');

    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(input).toHaveValue('Alice');
    expect(applyButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(applyButton);
    });

    const state = store.getState();
    expect(state.students.filters.learner_name).toBe('Alice');
    expect(state.students.filters.institution_id).toBe(456);
    expect(fetchStudentsData).toHaveBeenCalled();
  });

  test('switches to email input and applies filter correctly', async () => {
    const {
      getByTestId, getByPlaceholderText, getByText, store,
    } = renderWithProviders(
      <StudentsFilters />,
      { preloadedState: mockState },
    );

    const emailCheckbox = getByTestId('emailCheckbox');
    fireEvent.click(emailCheckbox);

    const emailInput = getByPlaceholderText('Student email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const applyButton = getByText('Apply');

    await act(async () => {
      fireEvent.click(applyButton);
    });

    const state = store.getState();
    expect(state.students.filters.learner_email).toBe('test@example.com');
    expect(state.students.filters.institution_id).toBe(456);
    expect(fetchStudentsData).toHaveBeenCalled();
  });

  test('resets filters when clicking Reset button', async () => {
    const { getByTestId, getByText, store } = renderWithProviders(<StudentsFilters />, {
      preloadedState: mockState,
    });

    const input = getByTestId('studentInput');
    fireEvent.change(input, { target: { value: 'Bob' } });
    expect(input).toHaveValue('Bob');

    const resetButton = getByText('Reset');
    expect(resetButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(resetButton);
    });

    const state = store.getState();
    expect(state.students.filters).toEqual({});
    expect(fetchStudentsData).toHaveBeenCalledWith(
      'demo_instructor',
      expect.objectContaining({ institution_id: 456 }),
    );
  });

  test('renders all Exam Ready options', async () => {
    const { getByText, getAllByText } = renderWithProviders(<StudentsFilters />, {
      preloadedState: mockState,
    });

    const select = getByText('Exam ready');
    fireEvent.mouseDown(select);

    const expectedOptions = [
      'In Progress',
      'Restarted',
      'EPP Eligible',
      'Unavailable',
      'Not Started',
    ];

    expectedOptions.forEach((option) => {
      expect(getAllByText(option)[0]).toBeInTheDocument();
    });
  });
});
