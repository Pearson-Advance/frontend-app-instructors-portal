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

/**
 * Number for initial page.
 * @readonly
 * @number
 */
export const initialPage = 1;

/**
 * Query parameter name for the institution ID.
 * @constant {string}
 */
export const INSTITUTION_QUERY_ID = 'institutionId';

/**
 * Limit of number of classes for profile.
 * @constant {number}
 */
export const CLASS_LIMIT = 3;

/**
 * Variants styles for badge.
 * @constant {Object}
 */
export const BADGE_VARIANTS = {
  active: 'success',
  inactive: 'secondary',
  expired: 'danger',
  pending: 'warning',
  in_progress: 'info',
  complete: 'success',
};

/**
 * Custom styles for selector without borders.
 *@object
 */
export const stylesSelectorNoBorders = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    border: 0,
    boxShadow: state.isFocused ? 0 : 0,
  }),
  indicatorsContainer: (baseStyles) => ({
    ...baseStyles,
    alignItems: 'baseline',
  }),
  singleValue: (baseStyles) => ({
    ...baseStyles,
    color: '#666',
    fontSize: '1rem',
    fontWeight: '700',
  }),
};

/**
 * Text for unauthorized user.
 * @constant {string}
 */
export const unauthorizedText = 'You do not have access to CertPREP Instructor. If you believe you should have access please contact your administrator.';

/**
 * Number for maximum records in tables.
 * @readonly
 * @number
 */
export const MAX_TABLE_RECORDS = 200;
