import React from 'react';
import { renderWithProviders } from 'test-utils';
import '@testing-library/jest-dom/extend-expect';

import Availability from 'features/Instructor/Availability';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('Availavility', () => {
  test('Should render availability section', () => {
    const { getByText } = renderWithProviders(
      <Availability />,
      { preloadedState: {} },
    );

    expect(getByText('Availability')).toBeInTheDocument();
    expect(getByText('New event')).toBeInTheDocument();
  });
});
