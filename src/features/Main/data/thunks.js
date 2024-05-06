import { logError } from '@edx/frontend-platform/logging';
import { camelCaseObject } from '@edx/frontend-platform';
import { getInstitutionName } from 'features/Main/data/api';
import {
  updateSelectedInstitutions,
} from 'features/Main/data/slice';
import { RequestStatus } from 'features/constants';

function fetchInstitutionData() {
  return async (dispatch) => {
    dispatch(updateSelectedInstitutions({ status: RequestStatus.LOADING }));
    try {
      const { data } = camelCaseObject(await getInstitutionName());
      dispatch(updateSelectedInstitutions({ status: RequestStatus.SUCCESS, data }));
    } catch (error) {
      dispatch(updateSelectedInstitutions({ status: RequestStatus.ERROR, error }));
      logError(error);
    }
  };
}

export {
  fetchInstitutionData,
};
