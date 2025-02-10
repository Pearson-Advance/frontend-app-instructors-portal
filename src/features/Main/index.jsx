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

import { Container, Spinner } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';

import { Banner } from 'react-paragon-topaz';

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
import UnauthorizedPage from 'features/Main/UnauthorizedPage';

import { fetchInstitutionData, fetchClassAuthorization } from 'features/Main/data/thunks';
import { updateSelectedInstitution } from 'features/Main/data/slice';

import { INSTITUTION_QUERY_ID, RequestStatus } from 'features/constants';

import './index.scss';

const Main = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const institutions = useSelector((state) => state.main.institutions.data);
  const username = useSelector((state) => state.main.username);
  const classes = useSelector((state) => state.main.classes);

  const bannerText = getConfig().MAINTENANCE_BANNER_TEXT || '';

  const isLoadingClasses = classes.status === RequestStatus.LOADING || classes.status === RequestStatus.INITIAL;
  const isUnauthorizedUser = classes.error === 403;

  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    dispatch(fetchInstitutionData());
  }, [dispatch]);

  useEffect(() => {
    if (username) {
      dispatch(fetchClassAuthorization(username));
    }
  }, [dispatch, username]);

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
      {bannerText && (
        <Banner variant="warning" iconWarning text={bannerText} />
      )}
      <main className="d-flex pageWrapper">
        {isLoadingClasses && (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center mt-4">
            <Spinner
              animation="border"
              className="me-3"
              screenReaderText="loading"
            />
          </div>
        )}
        {!isLoadingClasses && isUnauthorizedUser && <UnauthorizedPage />}
        {!isLoadingClasses && !isUnauthorizedUser && (
          <>
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
          </>
        )}
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default Main;
