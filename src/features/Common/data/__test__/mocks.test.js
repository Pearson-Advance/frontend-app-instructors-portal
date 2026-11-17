import { getConfig } from '@edx/frontend-platform';

import {
  MOCK_SESSIONS,
  isOfferingsFlagEnabled,
  getMockSessionForClass,
  withMockSessionNames,
  getMockSessionOptions,
  filterBySession,
} from 'features/Common/data/mocks';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('Sessions mocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('isOfferingsFlagEnabled reflects the PSS_ENABLE_OFFERINGS flag', () => {
    getConfig.mockReturnValue({ PSS_ENABLE_OFFERINGS: true });
    expect(isOfferingsFlagEnabled()).toBe(true);

    getConfig.mockReturnValue({ PSS_ENABLE_OFFERINGS: false });
    expect(isOfferingsFlagEnabled()).toBe(false);
  });

  test('getMockSessionForClass returns a deterministic session name', () => {
    const first = getMockSessionForClass('class-1');
    const second = getMockSessionForClass('class-1');

    expect(first).toBe(second);
    expect(MOCK_SESSIONS.map((session) => session.name)).toContain(first);
  });

  test('withMockSessionNames injects a sessionName on each class', () => {
    const result = withMockSessionNames([
      { classId: 'class-1' },
      { classId: 'class-2', sessionName: 'Existing' },
    ]);

    expect(result[0].sessionName).toBe(getMockSessionForClass('class-1'));
    expect(result[1].sessionName).toBe('Existing');
  });

  test('getMockSessionOptions maps sessions to select options', () => {
    expect(getMockSessionOptions()).toEqual(
      MOCK_SESSIONS.map(({ name }) => ({ label: name, value: name })),
    );
  });

  test('filterBySession filters by session name and returns all when empty', () => {
    const classes = [
      { classId: 'a', sessionName: 'Fall 2025 Cohort' },
      { classId: 'b', sessionName: 'Spring 2026 Cohort' },
    ];

    expect(filterBySession(classes, 'Fall 2025 Cohort')).toEqual([classes[0]]);
    expect(filterBySession(classes, '')).toEqual(classes);
  });
});
