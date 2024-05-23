import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';

import { Footer } from 'features/Main/Footer';

describe('Footer Component', () => {
  test('Should render the component', async () => {
    render(<Footer />);

    await waitFor(() => {
      const footerElement = screen.getByRole('contentinfo');
      expect(footerElement).toBeInTheDocument();
    });
  });

  test('Should render two footer links', async () => {
    render(<Footer />);

    await waitFor(() => {
      const linkElements = screen.getAllByRole('link');
      expect(linkElements).toHaveLength(2);
    });
  });
});
