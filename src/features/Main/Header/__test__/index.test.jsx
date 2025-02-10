import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import { renderWithProviders } from 'test-utils';

import { Header } from 'features/Main/Header';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://localhost:1990',
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v2',
    ACCOUNT_PROFILE_URL: 'https://example.com/profile',
  })),
}));

describe('Header', () => {
  const authenticatedUser = {
    username: 'User',
  };

  const config = {
    ACCOUNT_PROFILE_URL: 'https://example.com/profile',
    LMS_BASE_URL: 'http://localhost:1990',
  };

  test('Should render the header correctly', () => {
    const { getByText } = renderWithProviders(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header />
      </AppContext.Provider>,
    );

    const titleApp = getByText('Pearson Skilling Instructor');
    const userName = getByText('User');

    expect(userName).toBeInTheDocument();
    expect(titleApp).toBeInTheDocument();
  });

  test('Should toggle the account menu on button click', () => {
    const { getByRole, getByText } = renderWithProviders(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header />
      </AppContext.Provider>,
    );

    const button = getByRole('button');
    fireEvent.click(button);

    const profileLink = getByText('Profile');
    const logOutLink = getByText('Log Out');

    expect(profileLink).toBeInTheDocument();
    expect(logOutLink).toBeInTheDocument();
  });

  test('Should have correct href attributes for the links', () => {
    const { getByText, getByRole } = renderWithProviders(
      <AppContext.Provider value={{ authenticatedUser, config }}>
        <Header />
      </AppContext.Provider>,
    );

    const menuButton = getByRole('button');
    fireEvent.click(menuButton);
    const profileLink = getByText('Profile');
    const logOutLink = getByText('Log Out');

    expect(profileLink).toHaveAttribute('href', `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`);
    expect(logOutLink).toHaveAttribute('href', `${config.LMS_BASE_URL}/logout`);
  });
});
