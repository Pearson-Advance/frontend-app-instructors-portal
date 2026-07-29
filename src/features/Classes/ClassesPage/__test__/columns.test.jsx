import React from 'react';
import { act } from '@testing-library/react';

import { renderWithProviders } from 'test-utils';

import { columns } from 'features/Classes/ClassesPage/columns';
import { fetchGradebookCsv } from 'features/Classes/data/api';
import { downloadFileFromBlob } from 'helpers';

jest.mock('features/Main/ActionsDropdown', () => jest.fn(() => <div data-testid="actions-dropdown" />));

jest.mock('features/Classes/EnrollStudent', () => function EnrollStudent() {
  return <div data-testid="enroll-student" />;
});

jest.mock('features/Classes/data/api', () => ({
  fetchGradebookCsv: jest.fn(),
}));

jest.mock('helpers', () => ({
  downloadFileFromBlob: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LEARNING_MICROFRONTEND_URL: 'http://localhost:2000',
    GRADEBOOK_MICROFRONTEND_URL: '',
    LMS_BASE_URL: '',
  })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@openedx/paragon', () => ({
  // eslint-disable-next-line react/prop-types
  Toast: function MockToast({ show, children }) {
    return show ? <div>{children}</div> : null;
  },
}));

describe('ClassesPage columns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('adds View class content as the first action', () => {
    const ActionColumn = () => columns[8].Cell({
      row: {
        values: {},
        original: {
          classId: 'class-1',
          className: 'Class 1',
          labSummaryTag: null,
        },
      },
    });

    renderWithProviders(<ActionColumn />, {
      preloadedState: {
        instructor: {
          info: {},
        },
      },
      initialEntries: ['/classes'],
    });

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const mockActionsDropdown = require('features/Main/ActionsDropdown').default || require('features/Main/ActionsDropdown');
    const [props] = mockActionsDropdown.mock.calls[0];

    expect(props.options).toHaveLength(5);
    expect(props.options[0]).toMatchObject({
      label: 'View class content',
      visible: true,
    });
  });

  test('adds Download Gradebook alongside Gradebook action', () => {
    const ActionColumn = () => columns[8].Cell({
      row: {
        values: {},
        original: {
          classId: 'class-1',
          className: 'Class 1',
          labSummaryTag: null,
        },
      },
    });

    renderWithProviders(<ActionColumn />, {
      preloadedState: {
        instructor: {
          info: {},
        },
      },
      initialEntries: ['/classes'],
    });

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const mockActionsDropdown = require('features/Main/ActionsDropdown').default || require('features/Main/ActionsDropdown');
    const [props] = mockActionsDropdown.mock.calls[0];

    expect(props.options[1]).toMatchObject({
      label: 'Gradebook',
      visible: true,
    });
    expect(props.options[2]).toMatchObject({
      label: 'Download Gradebook',
      visible: true,
      disabled: false,
    });
  });

  test('downloads the gradebook CSV using the decoded class id and blocks duplicate clicks', async () => {
    let resolveRequest;
    fetchGradebookCsv.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));

    const ActionColumn = () => columns[8].Cell({
      row: {
        values: {},
        original: {
          classId: 'class-1%40demo',
          className: 'Class 1',
          labSummaryTag: null,
        },
      },
    });

    renderWithProviders(<ActionColumn />, {
      preloadedState: {
        instructor: {
          info: {},
        },
      },
      initialEntries: ['/classes'],
    });

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const mockActionsDropdown = require('features/Main/ActionsDropdown').default || require('features/Main/ActionsDropdown');
    const getLatestOptions = () => mockActionsDropdown.mock.calls[mockActionsDropdown.mock.calls.length - 1][0].options;

    let downloadPromise;
    act(() => {
      downloadPromise = getLatestOptions()[2].handleClick();
    });

    // Clicking again while the request is in flight should be ignored.
    act(() => {
      getLatestOptions()[2].handleClick();
    });

    expect(fetchGradebookCsv).toHaveBeenCalledTimes(1);
    expect(fetchGradebookCsv).toHaveBeenCalledWith('class-1@demo');

    await act(async () => {
      resolveRequest({ data: 'csv,data' });
      await downloadPromise;
    });

    expect(downloadFileFromBlob).toHaveBeenCalledWith('csv,data', 'class-1@demo-ccx-grades.csv');
  });

  test('shows an error message when the gradebook download fails', async () => {
    fetchGradebookCsv.mockRejectedValue(new Error('network error'));

    const ActionColumn = () => columns[8].Cell({
      row: {
        values: {},
        original: {
          classId: 'class-1',
          className: 'Class 1',
          labSummaryTag: null,
        },
      },
    });

    const { findByText } = renderWithProviders(<ActionColumn />, {
      preloadedState: {
        instructor: {
          info: {},
        },
      },
      initialEntries: ['/classes'],
    });

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const mockActionsDropdown = require('features/Main/ActionsDropdown').default || require('features/Main/ActionsDropdown');
    const [props] = mockActionsDropdown.mock.calls[0];
    const { handleClick } = props.options[2];

    await act(async () => {
      await handleClick();
    });

    expect(await findByText('An error occurred while downloading the gradebook. Please try again.')).toBeInTheDocument();
  });
});
