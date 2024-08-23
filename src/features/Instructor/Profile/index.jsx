import React, {
  useContext, useEffect, useState, useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '@edx/frontend-platform/react';
import {
  Link,
} from 'react-router-dom';

import {
  Tabs,
  Tab,
  Container,
  Pagination,
} from '@edx/paragon';
import { ProfileCard, formatUTCDate } from 'react-paragon-topaz';

import Availability from 'features/Instructor/Availability';

import Table from 'features/Main/Table';
import { getClasses } from 'features/Classes/data';
import { fetchInstructorProfile } from 'features/Instructor/data';
import { resetClassesTable, updateCurrentPage } from 'features/Classes/data/slice';

import { useInstitutionIdQueryParam } from 'hooks';

import { columns } from 'features/Instructor/Profile/columns';

import { RequestStatus, initialPage, CLASS_LIMIT } from 'features/constants';

const Profile = () => {
  const dispatch = useDispatch();
  const { authenticatedUser } = useContext(AppContext);
  const instructorEmail = authenticatedUser.email;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const {
    instructorImage,
    instructorName,
    lastAccess,
    status,
    created,
  } = useSelector((state) => state.instructor.info);
  const instructorUserName = useSelector((state) => state.main.username);
  const classes = useSelector((state) => state.classes.table);
  const institution = useSelector((state) => state.main.institution);
  const addQueryParam = useInstitutionIdQueryParam();

  const COLUMNS = useMemo(() => columns, []);

  const isLoading = status === RequestStatus.LOADING;
  const isTableLoading = classes.status === RequestStatus.LOADING;

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  useEffect(() => {
    if (instructorEmail) {
      dispatch(fetchInstructorProfile(instructorEmail));
    }
  }, [instructorEmail, dispatch, instructorUserName, institution]);

  useEffect(() => {
    if (instructorEmail) {
      dispatch(getClasses(instructorUserName, { institution_id: institution?.id, limit: true, page: currentPage }));
    }

    return () => dispatch(resetClassesTable());
  }, [instructorEmail, dispatch, instructorUserName, institution, currentPage]);

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex align-items-center my-4">
        <h3 className="h2 mb-0 course-title">{instructorName || instructorUserName}</h3>
      </div>
      <Tabs
        variant="tabs"
        defaultActiveKey="profile"
        className="mb-3 nav-tabs"
      >
        <Tab eventKey="profile" title="Profile">
          <ProfileCard
            profileImage={instructorImage}
            email={authenticatedUser.email}
            userRole="Instructor"
            name={instructorName || instructorUserName}
            lastAccessDate={formatUTCDate(lastAccess)}
            isLoading={isLoading}
            createdDate={formatUTCDate(created)}
          >
            {classes.data.length > 0 && (
              <>
                <h3 className="text-uppercase">Courses taught</h3>
                {classes.data?.slice(0, CLASS_LIMIT).map(({ classId, className }) => {
                  const url = addQueryParam(`/classes/${classId}?previous=my-profile`);

                  return (
                    <Link
                      to={url}
                      key={classId}
                      className="text-truncate link"
                    >
                      {className}
                    </Link>
                  );
                })}
              </>
            )}
          </ProfileCard>
        </Tab>
        <Tab eventKey="classes" title="Classes">
          <Table
            isLoading={isTableLoading}
            columns={COLUMNS}
            count={classes.count}
            data={classes.data}
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
        <Tab eventKey="availability" title="Availiability">
          <Availability />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;
