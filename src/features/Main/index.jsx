import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Container } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';

import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import { Sidebar } from 'features/Main/Sidebar';

import { fetchInstitutionData } from 'features/Main/data/thunks';
import { updateSelectedInstitution } from 'features/Main/data/slice';

import './index.scss';

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
    <BrowserRouter basename={getConfig().INSTRUCTOR_PORTAL_PATH}>
      <Header />
      <main className="d-flex page-wrapper">
        <Sidebar />
        <Container>
          <Switch>
            <Route path="/dashboard" exact>
              <div><p>{JSON.stringify(institutionsInfo.institution)}</p></div>
            </Route>
          </Switch>
        </Container>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default Main;
