import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { fireEvent, act } from '@testing-library/react';

import ClassesFilters from 'features/Classes/ClassesFilters';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('react-select', () => function reactSelect({ options, currentValue, onChange }) {
  function handleChange(event) {
    const currentOption = options.find(
      (option) => option.value === event.currentTarget.value,
    );
    onChange(currentOption);
  }

  return (
    <select data-testid="select" value={currentValue} onChange={handleChange}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});

describe('Classes filters', () => {
  const mockSetFilters = jest.fn();

  const mockStore = {
    common: {
      allCourses: {
        data: [
          {
            masterCourseName: 'Demo Course 1',
            numberOfClasses: 1,
            missingClassesForInstructor: null,
            numberOfStudents: 1,
            numberOfPendingStudents: 1,
          },
        ],
      },
      allClasses: {
        data: [
          {
            masterCourseName: 'course example',
            masterCourseId: 'demo course',
            classId: 'class01',
            className: 'class example',
            startDate: '',
            endDate: '',
            minStudents: 10,
            maxStudents: 100,
          },
        ],
      },
    },
  };

  beforeEach(() => {
    mockSetFilters.mockClear();
  });

  test('Should have the buttons disabled if the inputs are empty', () => {
    const { getByText } = renderWithProviders(
      <ClassesFilters />,
    );

    const resetFilterButton = getByText('Reset');
    const applyFilterButton = getByText('Apply');

    expect(resetFilterButton).toBeDisabled();
    expect(applyFilterButton).toBeDisabled();
  });

  test('Should call the service when apply filters', async () => {
    const { getByText, getAllByTestId } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const classesSelect = getAllByTestId('select')[1];
    const buttonApplyFilters = getByText('Apply');

    expect(courseSelect).toBeInTheDocument();
    expect(classesSelect).toBeInTheDocument();

    fireEvent.change(classesSelect, {
      target: { value: 'class01' },
    });

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    expect(getByText('class example')).toBeInTheDocument();
    expect(getByText('Demo Course 1')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });
  });

  test('Clear filters', async () => {
    const { getByText, getAllByTestId } = renderWithProviders(
      <ClassesFilters />,
      { preloadedState: mockStore },
    );

    const courseSelect = getAllByTestId('select')[0];
    const buttonClearFilters = getByText('Reset');

    expect(courseSelect).toBeInTheDocument();
    expect(courseSelect).toBeInTheDocument();

    fireEvent.change(courseSelect, {
      target: { value: 'Demo Course 1' },
    });

    await act(async () => {
      fireEvent.click(buttonClearFilters);
    });
  });
});
