import React from 'react';
import { fireEvent } from '@testing-library/react';

import { Sidebar } from 'features/Main/Sidebar';
import { renderWithProviders } from 'test-utils';
import * as paragonTopaz from 'react-paragon-topaz';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    INSTITUTION_PORTAL_PATH: 'https://institution.example.com',
  })),
}));

jest.mock('react-paragon-topaz', () => ({
  ...jest.requireActual('react-paragon-topaz'),
  getUserRoles: jest.fn(() => (['INSTRUCTOR'])),
}));

const defaultInitialState = {
  main: {
    activeTab: 'dashboard',
    institution: {},
  },
};

describe('Sidebar', () => {
  test('Should render the sidebar with all options', () => {
    const { getByText } = renderWithProviders(
      <Sidebar />,
      { preloadedState: defaultInitialState },
    );

    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Students')).toBeInTheDocument();
    expect(getByText('Classes')).toBeInTheDocument();
    expect(getByText('My profile')).toBeInTheDocument();
  });

  test('Should change selection on click in any item', () => {
    const { getByRole } = renderWithProviders(
      <Sidebar />,
      { preloadedState: defaultInitialState },
    );

    const profileButton = getByRole('button', { name: /my profile/i });
    expect(profileButton).toBeInTheDocument();

    fireEvent.click(profileButton);
    expect(profileButton).toHaveClass('active');

    expect(mockNavigate).toHaveBeenCalledWith('/my-profile');
  });

  test('should render Institution Portal item if has role', () => {
    paragonTopaz.getUserRoles.mockReturnValue(['INSTRUCTOR', 'INSTITUTION_ADMIN']);

    const { getByText } = renderWithProviders(
      <Sidebar />,
      { preloadedState: defaultInitialState },
    );

    expect(getByText('Skilling Administrator')).toBeInTheDocument();
  });

  test('should use institution supportLink for Contact Support when provided', () => {
    const customSupportLink = 'https://custom-support.example.com';
    const { getByText } = renderWithProviders(
      <Sidebar />,
      {
        preloadedState: {
          ...defaultInitialState,
          main: {
            ...defaultInitialState.main,
            institution: { supportLink: customSupportLink },
          },
        },
      },
    );

    const contactSupportLink = getByText('Contact Support').closest('a');
    expect(contactSupportLink).toHaveAttribute('href', customSupportLink);
  });

  test('should use default Contact Support link when institution has no supportLink', () => {
    const defaultSupportLink = 'https://skilling.pearsonvue.com/pearson-core/support/';
    const { getByText } = renderWithProviders(
      <Sidebar />,
      { preloadedState: defaultInitialState },
    );

    const contactSupportLink = getByText('Contact Support').closest('a');
    expect(contactSupportLink).toHaveAttribute('href', defaultSupportLink);
  });
});
