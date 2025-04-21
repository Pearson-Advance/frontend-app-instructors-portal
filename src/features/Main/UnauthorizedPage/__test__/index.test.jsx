import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UnauthorizedPage from 'features/Main/UnauthorizedPage';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:18000',
  })),
}));

describe('Unauthorized Component', () => {
  test('should render message', async () => {
    const { getByText, getByRole } = render(<UnauthorizedPage />);

    expect(getByText(/Pearson Skilling Suite Admin Portal/i)).toBeInTheDocument();

    // Check the link is rendered correctly
    const link = getByRole('link', { name: 'http://localhost:18000' });
    expect(link).toHaveAttribute('href', 'http://localhost:18000');
  });
});
