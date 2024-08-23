import React from 'react';
import { renderWithProviders } from 'test-utils';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import AddEvent from 'features/Instructor/AddEvent';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('Add Event modal', () => {
  test('Should render the fields', () => {
    const { getByText, getByRole } = renderWithProviders(
      <AddEvent isOpen onClose={() => {}} />,
      { preloadedState: {} },
    );

    expect(getByText('New Event')).toBeInTheDocument();
    expect(getByText('Not available')).toBeInTheDocument();
    expect(getByText('All day')).toBeInTheDocument();
    expect(getByText('Does not repeat')).toBeInTheDocument();
    expect(getByText('Start date')).toBeInTheDocument();
    expect(getByText('End date')).toBeInTheDocument();

    fireEvent.click(getByRole('switch'));
    expect(getByText('From')).toBeInTheDocument();
    expect(getByText('To')).toBeInTheDocument();
  });

  test('should handle changes in fields', () => {
    const {
      getByRole, getAllByRole, getByPlaceholderText,
    } = renderWithProviders(
      <AddEvent isOpen onClose={() => {}} />,
      { preloadedState: {} },
    );

    const switchField = getByRole('switch');
    const radioInputs = getAllByRole('radio');
    const startDateField = getByPlaceholderText('Start date');
    const endDateField = getByPlaceholderText('End date');

    fireEvent.click(switchField);
    fireEvent.click(radioInputs[1]);
    fireEvent.change(startDateField, { target: { value: '2024-08-20' } });
    fireEvent.change(endDateField, { target: { value: '2024-08-21' } });

    const startHourField = getByPlaceholderText('From');
    const endHourFiled = getByPlaceholderText('To');

    fireEvent.change(startHourField, { target: { value: '19:20' } });
    fireEvent.change(endHourFiled, { target: { value: '20:20' } });

    expect(switchField).not.toBeChecked();
    expect(radioInputs[1]).toBeChecked();
    expect(startDateField).toHaveValue('2024-08-20');
    expect(endDateField).toHaveValue('2024-08-21');
    expect(startHourField).toHaveValue('19:20');
    expect(endHourFiled).toHaveValue('20:20');
  });
});
