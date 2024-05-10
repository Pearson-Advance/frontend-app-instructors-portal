/**
 * Enum for request status.
 * @readonly
 * @enum {string}
 */
export const RequestStatus = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  INITIAL: 'initial',
  COMPLETE_WITH_ERRORS: 'complete-with-errors',
};

/**
 * Obj for initial service state.
 * @object
 */
export const initialStateService = {
  data: [],
  status: RequestStatus.LOADING,
  error: null,
};
