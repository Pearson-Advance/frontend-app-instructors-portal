import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { fireEvent, act } from '@testing-library/react';

import ClassesFilters from 'features/Classes/ClassesFilters';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('react-select', () => function reactSelect({ options, value, onChange }) {
  function handleChange(event) {
    const currentOption = options.find(
      (option) => String(option.value) === event.currentTarget.value,
    );
    onChange(currentOption);
  }

  return (
    <select data-testid="select" value={value?.value || ''} onChange={handleChange}>
      <option value="" label="label" />
      {options.map(({ label, value: optionValue }) => (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
});

describe('Classes filters', () => {
  const mockStore = {
    main: {
      username: 'testUser',
      institution: { id: 1 },
    },
    classes: {
      filters: {},
      table: {
        status: 'success',
        data: [],
        currentPage: 1,
      },
    },
    common: {
      allCourses: {
        status: 'success',
        data: [
          { masterCourseName: 'Demo Course 1' },
        ],
      },
      allClasses: {
        status: 'success',
        data: [
          {
            classId: 'class01',
            className: 'class example',
          },
        ],
      },
    },
  };

  test('Should have the buttons disabled if inputs are empty', () => {
    const { getByText } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    expect(getByText('Reset')).toBeDisabled();
    expect(getByText('Apply')).toBeDisabled();
  });

  test('Should enable Apply with valid class_name', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    const input = getByTestId('class_name');
    const button = getByText('Apply');

    expect(button).toBeDisabled();

    fireEvent.change(input, {
      target: { value: 'ab' },
    });

    expect(button).toBeEnabled();
  });

  test('Should enable Apply when start_date is set', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    const startDateInput = getByTestId('start_date');
    const button = getByText('Apply');

    expect(button).toBeDisabled();

    fireEvent.change(startDateInput, {
      target: { value: '2024-01-15' },
    });

    expect(button).toBeEnabled();
  });

  test('Should enable Apply when end_date is set', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    const endDateInput = getByTestId('end_date');
    const button = getByText('Apply');

    expect(button).toBeDisabled();

    fireEvent.change(endDateInput, {
      target: { value: '2024-02-15' },
    });

    expect(button).toBeEnabled();
  });

  test('Should call the service when apply filters', async () => {
    const { getByText, getAllByTestId, getByTestId } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const classSelect = getAllByTestId('select')[1];
    const classInput = getByTestId('class_name');
    const startDateInput = getByTestId('start_date');
    const endDateInput = getByTestId('end_date');
    const buttonApply = getByText('Apply');

    fireEvent.change(classSelect, {
      target: { value: 'class01' },
    });

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    fireEvent.change(classInput, {
      target: { value: 'math' },
    });

    fireEvent.change(startDateInput, {
      target: { value: '2024-01-15' },
    });

    fireEvent.change(endDateInput, {
      target: { value: '2024-02-15' },
    });

    await act(async () => {
      fireEvent.click(buttonApply);
    });

    expect(buttonApply).toBeInTheDocument();
  });

  test('Should clear filters', async () => {
    const { getByText, getAllByTestId, getByTestId } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const classInput = getByTestId('class_name');
    const startDateInput = getByTestId('start_date');
    const endDateInput = getByTestId('end_date');
    const buttonReset = getByText('Reset');

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    fireEvent.change(classInput, {
      target: { value: 'test' },
    });

    fireEvent.change(startDateInput, {
      target: { value: '2024-01-15' },
    });

    fireEvent.change(endDateInput, {
      target: { value: '2024-02-15' },
    });

    await act(async () => {
      fireEvent.click(buttonReset);
    });

    expect(classInput).toHaveValue('');
    expect(startDateInput).toHaveValue('');
    expect(endDateInput).toHaveValue('');
  });

  test('Should subtract four weeks from start_date before sending to backend', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    const startDateInput = getByTestId('start_date');
    const buttonApply = getByText('Apply');

    fireEvent.change(startDateInput, {
      target: { value: '2024-02-12' },
    });

    await act(async () => {
      fireEvent.click(buttonApply);
    });

    expect(startDateInput).toHaveValue('2024-02-12');
  });
});
