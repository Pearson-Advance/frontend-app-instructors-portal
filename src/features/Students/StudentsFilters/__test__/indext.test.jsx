import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from 'test-utils';
import { fireEvent, act } from '@testing-library/react';

import StudentsFilters from 'features/Students/StudentsFilters';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('StudentsFilters', () => {
  const resetPagination = jest.fn();
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    mockSetFilters.mockClear();
  });

  test('Should have the buttons disabled if the inputs are empty', () => {
    const { getByText } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    const resetFilterButton = getByText('Reset');
    const applyFilterButton = getByText('Apply');

    expect(resetFilterButton).toBeDisabled();
    expect(applyFilterButton).toBeDisabled();
  });

  test('Should render name input and call service when apply filters', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderWithProviders(
      <StudentsFilters resetPagination={resetPagination} />,
    );

    expect(getByPlaceholderText('Student name')).toBeInTheDocument();
    expect(getByText('Course')).toBeInTheDocument();
    expect(getByText('Class')).toBeInTheDocument();
    expect(getByText('Exam ready')).toBeInTheDocument();

    const inputName = getByTestId('studentInput');
    const buttonApplyFilters = getByText('Apply');

    fireEvent.change(inputName, {
      target: { value: 'John Doe' },
    });

    expect(inputName).toHaveValue('John Doe');

    await act(async () => {
      fireEvent.click(buttonApplyFilters);
    });
  });

  test('Clear filters', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <StudentsFilters
        resetPagination={resetPagination}
      />,
    );

    const nameInput = getByPlaceholderText('Student name');
    const buttonClearFilters = getByText('Reset');

    expect(nameInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Name' } });

    expect(nameInput).toHaveValue('Name');

    await act(async () => {
      fireEvent.click(buttonClearFilters);
    });

    expect(nameInput).toHaveValue('');
  });
});
