import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchInstitutionData } from 'features/Main/data/thunks';
import { updateSelectedInstitution } from 'features/Main/data/slice';

const Main = () => {
  const dispatch = useDispatch();
  const institutionsInfo = useSelector((state) => state.main);

  React.useEffect(() => {
    dispatch(fetchInstitutionData());
  }, [dispatch]);

  React.useEffect(() => {
    if (institutionsInfo.institutions.data?.length > 0) {
      dispatch(updateSelectedInstitution({ data: institutionsInfo.institutions.data[0] }));
    }
  }, [dispatch, institutionsInfo.institutions]);

  return (
    <div><p>{JSON.stringify(institutionsInfo.institution)}</p></div>
  );
};

export default Main;
