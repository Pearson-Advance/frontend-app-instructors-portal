import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';

import { Container } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';

import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import { Sidebar } from 'features/Main/Sidebar';
import DashboardPage from 'features/Dashboard/DashboardPage';
import StudentsPage from 'features/Students/StudentsPage';
import ActiveTabUpdater from 'features/Main/ActiveTabUpdater';
import ClassDetailPage from 'features/Classes/ClassDetailPage';

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

  const routes = [
    { path: '/dashboard', component: DashboardPage, exact: true },
    { path: '/students', component: StudentsPage, exact: true },
    { path: '/classes/:classId', component: ClassDetailPage, exact: true },
  ];

  return (
    <BrowserRouter basename={getConfig().INSTRUCTOR_PORTAL_PATH}>
      <Header />
      <main className="d-flex page-wrapper">
        <Sidebar />
        <Container>
          <Switch>
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
            {routes.map(({ path, exact, component: Component }) => (
              <Route
                key={path}
                path={path}
                exact={exact}
                render={() => (
                  <ActiveTabUpdater path={path}>
                    <Component />
                  </ActiveTabUpdater>
                )}
              />
            ))}
          </Switch>
        </Container>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default Main;
