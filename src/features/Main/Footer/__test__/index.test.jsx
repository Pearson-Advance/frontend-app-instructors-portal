import React from 'react';
import { render, screen } from '@testing-library/react';

import { Footer } from 'features/Main/Footer';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => ({
    FOOTER_PRIVACY_POLICY_LINK: 'https://privacy.test',
    FOOTER_TERMS_OF_SERVICE_LINK: 'https://terms.test',
  }),
}));

describe('Footer Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render the component', () => {
    render(<Footer />);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  test('Should render two footer links', () => {
    render(<Footer />);

    const linkElements = screen.getAllByRole('link');
    expect(linkElements).toHaveLength(2);
  });
});
