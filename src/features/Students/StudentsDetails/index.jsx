import React, { useEffect } from 'react';
import { Button, formatUTCDate } from 'react-paragon-topaz';
import { getConfig } from '@edx/frontend-platform';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tabs,
  Tab,
  Spinner,
  Container,
} from '@edx/paragon';
import {
  Link,
  useParams,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { RequestStatus } from 'features/constants';
import { resetStudent } from 'features/Students/data/slice';
import { fetchStudentProfile } from 'features/Students/data';

import './index.scss';

const StudentsDetails = () => {
  const history = useHistory();
  const location = useLocation();
  const { learnerEmail } = useParams();
  const instructorUserName = useSelector((state) => state.main.username);
  const isLoading = useSelector((state) => state.students.student.status) === RequestStatus.LOADING;
  const hasError = useSelector((state) => state.students.student.status) === RequestStatus.ERROR;

  const decodedEmail = decodeURIComponent(learnerEmail);

  const {
    classId,
    className,
    created,
    lastAccess,
    userImageUrl,
    learnerName = hasError ? 'Error' : 'Loading user...',
  } = useSelector((state) => state.students.student);

  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const previousPage = queryParams.get('previous') || 'students';

  const handleBackButton = () => (history.push(`/${previousPage}`));

  const originDomain = getConfig().BASE_URL;
  const studentImage = userImageUrl && userImageUrl.startsWith('/') ? originDomain + userImageUrl : userImageUrl;

  useEffect(() => {
    const studentParams = {
      learner_email: decodedEmail,
    };

    dispatch(fetchStudentProfile(instructorUserName, studentParams));

    return () => dispatch(resetStudent());
  }, [dispatch, instructorUserName, decodedEmail]);

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex align-items-center my-4">
        <Button onClick={handleBackButton} className="mr-3 link back-arrow" variant="tertiary">
          <i className="fa-solid fa-arrow-left" />
        </Button>
        <h3 className="h2 mb-0 course-title">{learnerName}</h3>
      </div>

      <Tabs
        variant="tabs"
        defaultActiveKey="profile"
        className="mb-3 nav-tabs"
      >
        <Tab eventKey="profile" title="Profile">
          <section className="page-content-container p-4 d-flex flex-column">
            {
              isLoading && (
                <div className="w-full d-flex justify-content-center wrapper-loading align-items-center">
                  <Spinner animation="border" className="mie-3" screenReaderText="loading" />
                </div>
              )
            }
            {hasError && (
              <div className="w-full d-flex justify-content-center wrapper-loading align-items-center">
                <p>Unable to get student info, please check the url and try again.</p>

              </div>
            )}

            {(!isLoading && !hasError) && (
              <>
                <div className="d-flex flex-column mb-3">
                  <div className="d-flex align-content-center mb-4">
                    {studentImage && <img src={studentImage} alt="user profile" className="student-image mr-3 mr-md-4 " />}
                    <div className="d-flex flex-column justify-content-center">
                      <h3 className="text-uppercase">Student</h3>
                      <p className="font-weight-bold text-black mb-0">{learnerName}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fa-light fa-envelope mt-1 mr-2" />
                    <a href={`mailto:${decodedEmail}`} className="text-primary">
                      {decodedEmail}
                    </a>
                  </div>
                </div>
                <div className="d-flex flex-column flex-md-row info-divider mt-3 pt-4 justify-content-between">
                  <div className="d-flex flex-column mr-md-3">
                    <h3 className="text-uppercase">Recent courses taken</h3>
                    <Link
                      to={`/classes/${classId}?previous=students`}
                      className="text-truncate link"
                    >
                      {className}
                    </Link>
                  </div>
                  <div className="d-flex mr-0 mr-md-5 mt-5 mt-md-0">
                    <div className="d-flex flex-column mr-5">
                      <h3 className="text-uppercase">student since</h3>
                      <p className="text-md-center">{formatUTCDate(created)}</p>
                    </div>
                    <div>
                      <h3 className="text-uppercase">last online</h3>
                      <p className="text-center">{formatUTCDate(lastAccess)}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default StudentsDetails;
