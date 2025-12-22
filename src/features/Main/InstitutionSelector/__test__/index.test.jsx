import React from 'react';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { renderWithProviders } from 'test-utils';
import InstitutionSelector from 'features/Main/InstitutionSelector';

jest.mock('react-select', () => function reactSelect({ options, currentValue, onChange }) {
  function handleChange(event) {
    onChange({ id: event.currentTarget.value });

    return event;
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('InstitutionSelector', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const preloadedState = {
    main: {
      institutions: {
        data: [
          { id: 1, name: 'Institution 1' },
          { id: 2, name: 'Institution 2' },
        ],
      },
      institution: null,
    },
  };

  test('Should render the select options and handle selection', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <InstitutionSelector />,
      { preloadedState, initialEntries: ['/'] },
    );

    expect(getByText('Select an institution')).toBeInTheDocument();

    fireEvent.change(getByTestId('select'), { target: { value: '1' } });

    expect(getByText('Institution 1')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('Should render all my institutions option', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <InstitutionSelector />,
      { preloadedState, initialEntries: ['/'] },
    );

    expect(getByText('Select an institution')).toBeInTheDocument();

    fireEvent.change(getByTestId('select'), { target: { value: 'all_institutions' } });

    expect(getByText('All my institutions')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalled();
  });
});
