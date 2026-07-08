import React from 'react';

import { renderWithProviders } from 'test-utils';

import { columns } from 'features/Classes/ClassesPage/columns';

jest.mock('features/Main/ActionsDropdown', () => jest.fn(() => <div data-testid="actions-dropdown" />));

jest.mock('features/Classes/EnrollStudent', () => function EnrollStudent() {
  return <div data-testid="enroll-student" />;
});

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LEARNING_MICROFRONTEND_URL: 'http://localhost:2000',
    GRADEBOOK_MICROFRONTEND_URL: '',
    LMS_BASE_URL: '',
  })),
}));

jest.mock('@openedx/paragon', () => ({
  // eslint-disable-next-line react/prop-types
  Toast: function MockToast({ show, children }) {
    return show ? <div>{children}</div> : null;
  },
}));

describe('ClassesPage columns', () => {
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

    expect(props.options).toHaveLength(4);
    expect(props.options[0]).toMatchObject({
      label: 'View class content',
      visible: true,
    });
  });
});
