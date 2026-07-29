import React from 'react';
import { act } from '@testing-library/react';
import { Route } from 'react-router-dom';

import { renderWithProviders } from 'test-utils';

import ClassDetailPage from 'features/Classes/ClassDetailPage';
import { fetchGradebookCsv } from 'features/Classes/data/api';
import { downloadFileFromBlob } from 'helpers';
import { RequestStatus } from 'features/constants';

jest.mock('features/Classes/ClassDetailPage/InstructorCard', () => function InstructorCard() {
  return <div data-testid="instructor-card" />;
});

jest.mock('features/Classes/EnrollStudent', () => function EnrollStudent() {
  return <div data-testid="enroll-student" />;
});

jest.mock('features/Main/ActionsDropdown', () => jest.fn(() => <div data-testid="actions-dropdown" />));

jest.mock('features/Classes/data/api', () => ({
  fetchGradebookCsv: jest.fn(),
}));

jest.mock('helpers', () => ({
  ...jest.requireActual('helpers'),
  downloadFileFromBlob: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LEARNING_MICROFRONTEND_URL: 'http://localhost:2000',
    GRADEBOOK_MICROFRONTEND_URL: '',
    LMS_BASE_URL: '',
  })),
}));

const classId = 'ccx-v1:demo+demo1+2020+ccx@40';

const mockStore = {
  main: {
    username: 'instructor123',
    institution: { id: 1 },
  },
  common: {
    allClasses: {
      status: RequestStatus.SUCCESS,
      data: [
        {
          className: 'Demo Class',
          classId,
          labSummaryTag: null,
        },
      ],
    },
  },
  students: {
    table: {
      status: RequestStatus.SUCCESS,
      data: [],
      count: 0,
      numPages: 1,
    },
  },
  instructor: {
    info: { hasEnrollmentPrivilege: false },
  },
};

const renderPage = () => renderWithProviders(
  <Route path="/classes/:classId" element={<ClassDetailPage />} />,
  {
    preloadedState: mockStore,
    initialEntries: [`/classes/${classId}`],
  },
);

const getLatestOptions = () => {
  const mockActionsDropdown = require('features/Main/ActionsDropdown').default || require('features/Main/ActionsDropdown'); // eslint-disable-line global-require, import/no-dynamic-require
  return mockActionsDropdown.mock.calls[mockActionsDropdown.mock.calls.length - 1][0].options;
};

describe('ClassDetailPage - Download Gradebook action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('adds Download Gradebook alongside the Gradebook action', () => {
    renderPage();

    const options = getLatestOptions();

    expect(options[0]).toMatchObject({ label: 'Gradebook', visible: true });
    expect(options[1]).toMatchObject({ label: 'Download Gradebook', visible: true, disabled: false });
  });

  test('downloads the gradebook CSV using the ccx course id and blocks duplicate clicks', async () => {
    let resolveRequest;
    fetchGradebookCsv.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));

    renderPage();

    let downloadPromise;
    act(() => {
      downloadPromise = getLatestOptions()[1].handleClick();
    });

    // Clicking again while the request is in flight should be ignored.
    act(() => {
      getLatestOptions()[1].handleClick();
    });

    expect(fetchGradebookCsv).toHaveBeenCalledTimes(1);
    expect(fetchGradebookCsv).toHaveBeenCalledWith(classId);

    await act(async () => {
      resolveRequest({ data: 'csv,data' });
      await downloadPromise;
    });

    expect(downloadFileFromBlob).toHaveBeenCalledWith('csv,data', `${classId}-ccx-grades.csv`);
  });

  test('shows an error message when the gradebook download fails', async () => {
    fetchGradebookCsv.mockRejectedValue(new Error('network error'));

    const { findByText } = renderPage();

    await act(async () => {
      await getLatestOptions()[1].handleClick();
    });

    expect(await findByText('An error occurred while downloading the gradebook. Please try again.')).toBeInTheDocument();
  });
});
