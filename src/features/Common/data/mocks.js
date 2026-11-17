import { getConfig } from '@edx/frontend-platform';

/**
 * Temporary mock layer for the Sessions feature while the backend is not ready.
 * All exports are gated at the call sites by the `PSS_ENABLE_OFFERINGS` flag and
 * the institution `hasOfferings` capability, so nothing here affects the default
 * behavior. Remove once `/classes/` exposes `session_name` and the session filter.
 */

export const MOCK_SESSIONS = [
  { id: 1, name: 'Fall 2025 Cohort' },
  { id: 2, name: 'Spring 2026 Cohort' },
  { id: 3, name: 'Summer 2026 Cohort' },
];

export const isOfferingsFlagEnabled = () => Boolean(getConfig().PSS_ENABLE_OFFERINGS);

const hashToIndex = (value = '', modulo = 1) => {
  const str = String(value);
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i)) % modulo;
  }

  return hash;
};

export const getMockSessionForClass = (classId) => (
  MOCK_SESSIONS[hashToIndex(classId, MOCK_SESSIONS.length)]?.name
);

export const withMockSessionNames = (classes = []) => classes.map((classItem) => ({
  ...classItem,
  sessionName: classItem.sessionName || getMockSessionForClass(classItem.classId),
}));

export const getMockSessionOptions = () => MOCK_SESSIONS.map(({ name }) => ({ label: name, value: name }));

export const filterBySession = (classes = [], sessionName = '') => (
  sessionName
    ? classes.filter((classItem) => classItem.sessionName === sessionName)
    : classes
);
