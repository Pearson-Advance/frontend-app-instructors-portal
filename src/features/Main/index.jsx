import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { Container } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';

import { Header } from 'features/Main/Header';
import { Footer } from 'features/Main/Footer';
import { Sidebar } from 'features/Main/Sidebar';
import DashboardPage from 'features/Dashboard/DashboardPage';
import StudentsPage from 'features/Students/StudentsPage';
import StudentsDetails from 'features/Students/StudentsDetails';
import ActiveTabUpdater from 'features/Main/ActiveTabUpdater';
import ClassesPage from 'features/Classes/ClassesPage';
import ClassDetailPage from 'features/Classes/ClassDetailPage';
import InstitutionSelector from 'features/Main/InstitutionSelector';
import Profile from 'features/Instructor/Profile';

import { fetchInstitutionData } from 'features/Main/data/thunks';
import { updateSelectedInstitution } from 'features/Main/data/slice';

import { INSTITUTION_QUERY_ID } from 'features/constants';

import './index.scss';

const Main = () => {
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();
  const institutions = useSelector((state) => state.main.institutions.data);

  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    dispatch(fetchInstitutionData());
  }, [dispatch]);

  useEffect(() => {
    if (institutions?.length === 1) {
      searchParams.set(INSTITUTION_QUERY_ID, institutions[0]?.id);
      history.push({ search: searchParams.toString() });

      dispatch(updateSelectedInstitution({ data: institutions[0] }));
    }
  }, [institutions, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const routes = [
    { path: '/dashboard', component: DashboardPage, exact: true },
    { path: '/students', component: StudentsPage, exact: true },
    { path: '/students/:learnerEmail', component: StudentsDetails, exact: true },
    { path: '/classes/:classId', component: ClassDetailPage, exact: true },
    { path: '/classes', component: ClassesPage, exact: true },
    { path: '/my-profile', component: Profile, exact: true },
  ];

  return (
    <BrowserRouter basename={getConfig().INSTRUCTOR_PORTAL_PATH}>
      <Header />
      <main className="d-flex page-wrapper">
        <Sidebar />
        <Container>
          <Container size="xl" className="px-4">
            {institutions?.length > 1 && (<InstitutionSelector />)}
          </Container>
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
