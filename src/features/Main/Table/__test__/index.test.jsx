import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from 'test-utils';

import Table from 'features/Main/Table';

describe('Table component', () => {
  const columns = [
    {
      Header: 'Email',
      accessor: 'learnerEmail',
    },
  ];

  const data = [
    { learnerEmail: 'test1@example.com' },
    { learnerEmail: 'test2@example.com' },
  ];

  const count = 2;
  const text = 'No data available';

  test('Should render table with provided data', () => {
    renderWithProviders(
      <Table
        columns={columns}
        data={data}
        count={count}
        emptyText={text}
      />,
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(
      screen.getByText('test1@example.com'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('test2@example.com'),
    ).toBeInTheDocument();

    const footer = screen.getByTestId('row-status');
    expect(footer).toHaveTextContent('2');
    expect(footer).toHaveTextContent('Showing');
    expect(footer).toHaveTextContent('of 2');
  });

  test('Should render empty table with provided text when no data is available', () => {
    renderWithProviders(
      <Table
        columns={columns}
        data={[]}
        count={0}
        emptyText={text}
      />,
    );

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
