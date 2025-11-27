import React, { useEffect, useMemo, useState } from 'react';
import { Button, formatUTCDate } from 'react-paragon-topaz';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import {
  Tabs,
  Tab,
  Spinner,
  Container,
  Pagination,
} from '@edx/paragon';
import {
  Link,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useInstitutionIdQueryParam } from 'hooks';
import { RequestStatus, initialPage } from 'features/constants';

import Table from 'features/Main/Table';

import { getClasses } from 'features/Classes/data';
import { fetchStudentProfile } from 'features/Students/data';
import { resetStudent, resetStudentsTable } from 'features/Students/data/slice';
import { resetClassesTable, updateCurrentPage } from 'features/Classes/data/slice';
import { columns } from 'features/Students/StudentsDetails/columns';

import { isInvalidUserOrInstitution } from 'helpers';

import './index.scss';

const StudentsDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { learnerEmail } = useParams();
  const classes = useSelector((state) => state.classes.table);
  const institution = useSelector((state) => state.main.institution);
  const instructorUserName = useSelector((state) => state.main.username);

  const isLoading = useSelector((state) => state.students.student.status) === RequestStatus.LOADING;
  const hasError = useSelector((state) => state.students.student.status) === RequestStatus.ERROR;

  const {
    classId,
    className,
    created,
    lastAccess,
    userImageUrl,
    learnerName = hasError ? 'Error' : 'Loading user...',
  } = useSelector((state) => state.students.student);

  const students = useSelector((state) => state.students.table.data);

  const [currentPage, setCurrentPage] = useState(initialPage);

  const decodedEmail = decodeURIComponent(learnerEmail);
  const COLUMNS = useMemo(() => columns, []);

  const addQueryParam = useInstitutionIdQueryParam();
  const queryParams = new URLSearchParams(location.search);
  const previousPage = queryParams.get('previous') || 'students';

  const handleBackButton = () => (navigate(`/${previousPage}`));

  const originDomain = getConfig().BASE_URL;
  const studentImage = userImageUrl && userImageUrl.startsWith('/') ? `https://${originDomain}${userImageUrl}` : userImageUrl;

  const isTableLoading = classes.status === RequestStatus.LOADING;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    if (isInvalidUserOrInstitution(instructorUserName, institution)) { return () => {}; }

    const studentParams = {
      learner_email: decodedEmail,
      institution_id: institution?.id,
    };

    dispatch(fetchStudentProfile(instructorUserName, studentParams));

    return () => {
      dispatch(resetStudent());
      dispatch(resetStudentsTable());
    };
  }, [dispatch, instructorUserName, decodedEmail, institution]);

  useEffect(() => {
    if (isInvalidUserOrInstitution(instructorUserName, institution)) { return () => {}; }

    const requestParams = {
      institution_id: institution?.id,
      limit: true,
      page: currentPage,
      student_email: decodedEmail,
    };

    dispatch(getClasses(instructorUserName, requestParams));

    return () => dispatch(resetClassesTable());
  }, [instructorUserName, dispatch, institution, decodedEmail, currentPage]);

  const mergedStudentsAndClassesData = classes.data.map(classItem => {
    const student = students.find(stu => stu.classId === classItem.classId);
    return student ? { ...classItem, completePercentage: student.completePercentage } : classItem;
  });

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
        defaultActiveKey="classes-performance"
        className="mb-3 nav-tabs"
      >
        <Tab eventKey="classes-performance" title="Classes and performance">
          <Table
            isLoading={isTableLoading}
            columns={COLUMNS}
            count={classes.count}
            data={mergedStudentsAndClassesData}
            emptyText="No classes found."
            rowClassName="my-4"
          />

          {classes.numPages > 1 && (
            <Pagination
              paginationLabel="paginationNavigation"
              pageCount={classes.numPages}
              currentPage={currentPage}
              onPageSelect={handlePagination}
              variant="reduced"
              className="mx-auto pagination-table"
              size="small"
            />
          )}
        </Tab>
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
                      to={addQueryParam(`/classes/${classId}?previous=students`)}
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
