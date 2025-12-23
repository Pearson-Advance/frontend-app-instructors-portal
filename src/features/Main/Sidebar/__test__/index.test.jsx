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

describe('Sidebar', () => {
  test('Should render the sidebar with all options', () => {
    const { getByText } = renderWithProviders(<Sidebar />);

    const homeButton = getByText('Home');
    const studentsButton = getByText('Students');
    const classesButton = getByText('Classes');
    const myProfileButton = getByText('My profile');

    expect(homeButton).toBeInTheDocument();
    expect(studentsButton).toBeInTheDocument();
    expect(classesButton).toBeInTheDocument();
    expect(myProfileButton).toBeInTheDocument();
  });

  test('Should change selection on click in any item', () => {
    const { getByRole } = renderWithProviders(<Sidebar />);

    const profileButton = getByRole('button', { name: /my profile/i });
    expect(profileButton).toBeInTheDocument();

    fireEvent.click(profileButton);
    expect(profileButton).toHaveClass('active');

    expect(mockNavigate).toHaveBeenCalledWith('/my-profile');
  });

  test('should render Institution Portal item if has role', () => {
    paragonTopaz.getUserRoles.mockReturnValue(['INSTRUCTOR', 'INSTITUTION_ADMIN']);

    const { getByText } = renderWithProviders(<Sidebar />);

    const portalLink = getByText('Skilling Administrator');

    expect(portalLink).toBeInTheDocument();
  });
});
