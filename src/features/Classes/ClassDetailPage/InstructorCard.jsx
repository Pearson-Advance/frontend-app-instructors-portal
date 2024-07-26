import React from 'react';
import { useSelector } from 'react-redux';

import { formatDateRange } from 'react-paragon-topaz';
import { Spinner, ProgressBar } from '@edx/paragon';

import { RequestStatus } from 'features/constants';

const InstructorCard = () => {
  const classes = useSelector((state) => state.common.allClasses);
  const [classInfo] = classes.data;

  const isLoadingClasses = classes.status === RequestStatus.LOADING;

  const totalEnrolled = (classInfo?.numberOfStudents || 0)
    + (classInfo?.numberOfPendingStudents || 0);

  const percentageEnrolled = totalEnrolled && classInfo?.maxStudents
    ? ((totalEnrolled * 100) / classInfo.maxStudents)
    : 0;

  return (
    <article className="instructor-wrapper mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start page-content-container">
      <div className="d-flex flex-column w-100 justify-content-between w-100">
        {isLoadingClasses && (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <Spinner
              animation="border"
              className="mie-3"
              screenReaderText="loading"
            />
          </div>
        )}
        {!isLoadingClasses && (
          <>
            <h5 className="text-color text-uppercase font-weight-bold text-truncate w-75" title={classInfo?.masterCourseName}>
              {classInfo?.masterCourseName}
            </h5>
            <div className="text-uppercase d-flex my-1 align-items-baseline">
              <i className="fa-regular fa-calendar mr-2" />
              <p className="my-0">
                {formatDateRange(classInfo?.startDate, classInfo?.endDate)}
              </p>
            </div>
            <p className="text-color my-2">
              <b className="mr-1 text-uppercase">Enrollment:</b>
              {classInfo?.minStudentsAllowed && (
                <>minimum {classInfo.minStudentsAllowed}, </>
              )}
              enrolled {totalEnrolled}, maximum {classInfo?.maxStudents}
            </p>
            <div className="progress-enrolled my-2">
              <ProgressBar now={percentageEnrolled} variant="primary" />
            </div>
          </>
        )}
      </div>
    </article>
  );
};

export default InstructorCard;
