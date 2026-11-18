import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { sortAlphabetically } from 'react-paragon-topaz';

import {
  updateClassesTable,
  updateClassesRequestStatus,
} from 'features/Classes/data/slice';
import { getClassesByInstructor } from 'features/Common/data/api';
import { handleSkillableDashboard, handleXtremeLabsDashboard } from 'features/Classes/data/api';
import { isOfferingsFlagEnabled, withMockSessionNames, filterBySession } from 'features/Common/data/mocks';

import { RequestStatus } from 'features/constants';

function getClasses(userName, options = {}) {
  return async (dispatch, getState) => {
    dispatch(updateClassesRequestStatus(RequestStatus.LOADING));

    try {
      const response = camelCaseObject(await getClassesByInstructor(userName, options));
      const sortedData = sortAlphabetically(response.data.results, 'className');

      const institution = getState()?.main?.institution;
      const isSessionsEnabled = isOfferingsFlagEnabled() && Boolean(institution?.hasOfferings);

      let results = sortedData;
      let { count } = response.data;

      if (isSessionsEnabled) {
        results = withMockSessionNames(sortedData);

        if (options.session_name) {
          results = filterBySession(results, options.session_name);
          count = results.length;
        }
      }

      const classes = {
        ...response.data,
        results,
        count,
      };

      dispatch(updateClassesTable(classes));
    } catch (error) {
      dispatch(updateClassesRequestStatus(RequestStatus.ERROR));
      logError(error);
    }
  };
}

function fetchLabSummaryLink(classId, labSummaryTag, showToast) {
  return async () => {
    try {
      const labDashboardOptions = {
        'skillable-dashboard': handleSkillableDashboard,
        'xtreme-labs-dashboard': handleXtremeLabsDashboard,
      };

      const fetchDashboard = labDashboardOptions[labSummaryTag];

      if (!fetchDashboard) {
        throw new Error(`Unsupported lab summary tag: ${labSummaryTag}`);
      }

      const response = await fetchDashboard(classId);

      const url = response?.data?.url || response?.data?.redirect_to;

      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        const errorMessage = response?.data?.message || response?.data?.error;
        throw new Error(errorMessage);
      }
    } catch (error) {
      showToast(error.message || 'An unexpected error occurred.');
      logError(error);
    }
  };
}

export {
  getClasses,
  fetchLabSummaryLink,
};
