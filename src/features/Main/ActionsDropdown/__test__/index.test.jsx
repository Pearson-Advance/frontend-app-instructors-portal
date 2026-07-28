import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ActionsDropdown from '..';

describe('ActionsDropdown', () => {
  const optionsMock = [
    { handleClick: jest.fn(), label: 'Option 1', visible: true },
    { handleClick: jest.fn(), label: 'Option 2', visible: true },
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

  test('Should not call handleClick when the option is disabled', () => {
    const disabledOptionsMock = [
      {
        handleClick: jest.fn(), label: 'Disabled option', visible: true, disabled: true,
      },
    ];

    const { getByLabelText, getByText } = render(<ActionsDropdown options={disabledOptionsMock} />);
    const toggleButton = getByLabelText('menu for actions');

    fireEvent.click(toggleButton);

    const option = getByText('Disabled option');
    fireEvent.click(option);

    expect(disabledOptionsMock[0].handleClick).not.toHaveBeenCalled();
  });
});
