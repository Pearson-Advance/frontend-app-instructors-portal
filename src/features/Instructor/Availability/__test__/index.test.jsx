import React from 'react';
import { renderWithProviders } from 'test-utils';
import '@testing-library/jest-dom/extend-expect';

import Availability from 'features/Instructor/Availability';
import { fireEvent } from '@testing-library/react';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockStore = {
  instructor: {
    events: {
      data: [
        {
          id: 1,
          title: 'Not available',
          start: '2024-09-04T00:00:00Z',
          end: '2024-09-13T00:00:00Z',
          type: 'virtual',
        },
      ],
      count: 1,
      num_pages: 1,
      current_page: 1,
    },
  },
};

describe('Availavility', () => {
  test('Should render availability section', () => {
    const { getByText } = renderWithProviders(
      <Availability />,
      { preloadedState: {} },
    );

    expect(getByText('Availability')).toBeInTheDocument();
    expect(getByText('New event')).toBeInTheDocument();
  });

  test('Should render calendar expanded', () => {
    const { getByText } = renderWithProviders(
      <Availability />,
      { preloadedState: mockStore },
    );

    expect(getByText('Today')).toBeInTheDocument();
    expect(getByText('Sunday')).toBeInTheDocument();
    expect(getByText('Monday')).toBeInTheDocument();
    expect(getByText('Tuesday')).toBeInTheDocument();
    expect(getByText('Wednesday')).toBeInTheDocument();
    expect(getByText('Thursday')).toBeInTheDocument();
    expect(getByText('Friday')).toBeInTheDocument();
    expect(getByText('Saturday')).toBeInTheDocument();
  });

  test('should render new event modal', () => {
    const { getByText } = renderWithProviders(
      <Availability />,
      { preloadedState: mockStore },
    );

    const newEventBtn = getByText('New event');
    fireEvent.click(newEventBtn);
    expect(getByText('New Event')).toBeInTheDocument();
  });
});
