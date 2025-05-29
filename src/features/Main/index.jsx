import React, { useEffect, useContext } from 'react';
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
import { AppContext } from '@edx/frontend-platform/react';

import { Banner, getUserRoles, USER_ROLES } from 'react-paragon-topaz';

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

import { fetchInstructorProfile } from 'features/Instructor/data';
import { fetchInstitutionData } from 'features/Main/data/thunks';
import { updateSelectedInstitution } from 'features/Main/data/slice';

import { INSTITUTION_QUERY_ID, RequestStatus } from 'features/constants';
import { isInvalidUserOrInstitution } from 'helpers';

import './index.scss';

const Main = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const roles = getUserRoles();
  const { authenticatedUser } = useContext(AppContext);

  const institutions = useSelector((state) => state.main.institutions.data);
  const institution = useSelector((state) => state.main.institution);

  const bannerText = getConfig().MAINTENANCE_BANNER_TEXT || '';

  const statusInstitutions = useSelector((state) => state.main.institution.status);
  const isLoadingInstitutions = statusInstitutions === RequestStatus.LOADING;
  const isAuthorizedUser = roles.includes(USER_ROLES.INSTRUCTOR);

  const searchParams = new URLSearchParams(location.search);
  const instructorEmail = authenticatedUser.email;

  useEffect(() => {
    dispatch(fetchInstitutionData());
  }, [dispatch]);

  useEffect(() => {
    if (isInvalidUserOrInstitution(instructorEmail, institution)) { return; }

    dispatch(fetchInstructorProfile(instructorEmail, { institution_id: institution?.id }));
  }, [instructorEmail, dispatch, institution]);

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
        {isLoadingInstitutions && (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center mt-4">
            <Spinner
              animation="border"
              className="me-3"
              screenReaderText="loading"
            />
          </div>
        )}
        {!isLoadingInstitutions && !isAuthorizedUser && <UnauthorizedPage />}
        {!isLoadingInstitutions && isAuthorizedUser && (
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
