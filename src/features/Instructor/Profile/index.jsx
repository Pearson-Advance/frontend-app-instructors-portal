import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '@edx/frontend-platform/react';
import {
  Link,
} from 'react-router-dom';

import {
  Tabs,
  Tab,
  Container,
} from '@edx/paragon';
import { ProfileCard, formatUTCDate } from 'react-paragon-topaz';

import { fetchInstructorProfile } from 'features/Instructor/data';
import { fetchAllClassesData } from 'features/Common/data';

import { RequestStatus } from 'features/constants';

const Profile = () => {
  const dispatch = useDispatch();
  const { authenticatedUser } = useContext(AppContext);
  const instructorEmail = authenticatedUser.email;
  const {
    instructorImage,
    instructorName,
    lastAccess,
    status,
    created,
  } = useSelector((state) => state.instructor.info);
  const instructorUserName = useSelector((state) => state.main.username);
  const classes = useSelector((state) => state.common.allClasses.data);
  const institution = useSelector((state) => state.main.institution);

  const isLoading = status === RequestStatus.LOADING;

  useEffect(() => {
    if (instructorEmail) {
      dispatch(fetchInstructorProfile(instructorEmail));
      dispatch(fetchAllClassesData(instructorUserName, { institution_id: institution?.id }));
    }
  }, [instructorEmail, dispatch, instructorUserName, institution]);

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
            {classes.length > 0 && (
              <>
                <h3 className="text-uppercase">Courses taught</h3>
                {classes.map(({ classId, className }) => (
                  <Link
                    to={`/classes/${classId}?previous=my-profile`}
                    className="text-truncate link"
                    key={classId}
                  >
                    {className}
                  </Link>
                ))}
              </>
            )}
          </ProfileCard>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;
