import { useSelector } from 'react-redux';
import { useState } from 'react';
import { getConfig } from '@edx/frontend-platform';

import { INSTITUTION_QUERY_ID } from 'features/constants';

export const useInstitutionIdQueryParam = () => {
  const institutionId = useSelector((state) => state.main.institution?.id);

  const addQueryParam = (url) => {
    if (!institutionId) {
      return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${INSTITUTION_QUERY_ID}=${institutionId}`;
  };

  return addQueryParam;
};

/**
 * Controls visibility of the Sessions-related UI (class list column, filter and
 * class detail label).
 *
 * Enabled only when the `PSS_ENABLE_OFFERINGS` feature flag is on AND the backend
 * reports the current institution with `has_offerings` enabled.
 *
 * @returns {boolean} Whether the Sessions UI should be exposed.
 */
export const useProgramsAccess = () => {
  const institution = useSelector((state) => state.main.institution);
  const isFlagEnabled = Boolean(getConfig().PSS_ENABLE_OFFERINGS);

  return isFlagEnabled && Boolean(institution?.hasOfferings);
};

/**
 * Custom hook to manage toast notifications
 * @returns {Object} Toast state and methods
 */
export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
  });

  const showToast = (message) => {
    setToast({
      isVisible: true,
      message,
    });
  };

  const hideToast = () => {
    setToast({
      isVisible: false,
      message: '',
    });
  };

  return {
    isVisible: toast.isVisible,
    message: toast.message,
    showToast,
    hideToast,
  };
};
