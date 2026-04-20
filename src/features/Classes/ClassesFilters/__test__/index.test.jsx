import React from 'react';
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

  test('Should call the service when apply filters', async () => {
    const { getByText, getAllByTestId, getByTestId } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const classSelect = getAllByTestId('select')[1];
    const classInput = getByTestId('class_name');
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
    const buttonReset = getByText('Reset');

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    fireEvent.change(classInput, {
      target: { value: 'test' },
    });

    await act(async () => {
      fireEvent.click(buttonReset);
    });

    expect(classInput).toHaveValue('');
  });
});
