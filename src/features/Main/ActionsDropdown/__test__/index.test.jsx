import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionsDropdown from '..';

describe('ActionsDropdown', () => {
  const optionsMock = [
    { handleClick: jest.fn(), label: 'Option 1' },
    { handleClick: jest.fn(), label: 'Option 2' },
  ];

  test('Should render the dropdown toggle button', () => {
    const { getByLabelText } = render(<ActionsDropdown options={optionsMock} />);
    const toggleButton = getByLabelText('menu for actions');

    expect(toggleButton).toBeInTheDocument();
  });

  test('Should render options when the menu is toggled', () => {
    const { getByLabelText, getByText } = render(<ActionsDropdown options={optionsMock} />);
    const toggleButton = getByLabelText('menu for actions');

    fireEvent.click(toggleButton);

    optionsMock.forEach(({ label }) => {
      expect(getByText(label)).toBeInTheDocument();
    });
  });

  test('Should call the correct function when an option is clicked', () => {
    const { getByLabelText, getByText } = render(<ActionsDropdown options={optionsMock} />);
    const toggleButton = getByLabelText('menu for actions');

    fireEvent.click(toggleButton);

    const option1 = getByText('Option 1');
    fireEvent.click(option1);

    expect(optionsMock[0].handleClick).toHaveBeenCalledTimes(1);
    expect(optionsMock[1].handleClick).not.toHaveBeenCalled();
  });
});
