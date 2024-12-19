import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

import Table from 'features/Main/Table';
import { Button } from 'react-paragon-topaz';
import {
  Container,
  Dropdown,
  Icon,
  IconButton,
  Pagination,
} from '@edx/paragon';
import { MoreVert } from '@edx/paragon/icons';

import { useInstitutionIdQueryParam } from 'hooks';
import InstructorCard from 'features/Classes/ClassDetailPage/InstructorCard';
import EnrollStudent from 'features/Classes/EnrollStudent';

import { fetchStudentsData } from 'features/Students/data';
import { resetStudentsTable, updateCurrentPage } from 'features/Students/data/slice';
import { updateActiveTab } from 'features/Main/data/slice';
import { fetchAllClassesData } from 'features/Common/data';

import { columns } from 'features/Classes/ClassDetailPage/columns';
import { RequestStatus, initialPage } from 'features/constants';

import 'features/Classes/ClassDetailPage/index.scss';

const ClassDetailPage = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { classId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const previousPage = queryParams.get('previous') || 'classes';
  const students = useSelector((state) => state.students.table);
  const username = useSelector((state) => state.main.username);
  const institution = useSelector((state) => state.main.institution);
  const [classInfo] = useSelector((state) => state.common.allClasses?.data);
  const COLUMNS = useMemo(() => columns, []);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const isLoading = students.status === RequestStatus.LOADING;
  const classNameDecoded = decodeURIComponent(classInfo?.className || '');

  const classLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${classId}/home`;
  const gradebookUrl = getConfig().GRADEBOOK_MICROFRONTEND_URL || getConfig().LMS_BASE_URL;
  const addQueryParam = useInstitutionIdQueryParam();

  useEffect(() => {
    if (username && classNameDecoded) {
      const params = {
        page: currentPage,
        class_name: classNameDecoded,
        institution_id: institution?.id,
      };
      // Leaves a gap time space to prevent being override by ActiveTabUpdater component
      setTimeout(() => dispatch(updateActiveTab(previousPage)), 100);
      dispatch(fetchStudentsData(username, params));
    }

    return () => {
      dispatch(resetStudentsTable());
    };
  }, [username, dispatch, currentPage, classNameDecoded, previousPage, institution]);

  useEffect(() => {
    if (username) {
      const params = {
        class_id: classId,
        limit: false,
        institution_id: institution?.id,
      };
      dispatch(fetchAllClassesData(username, params));
    }
  }, [username, classId, dispatch, institution]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const handleBackButton = () => (previousPage ? history.push(addQueryParam(`/${previousPage}`)) : history.push(addQueryParam('/classes')));

  const handleEnrollStudentModal = () => setIsEnrollModalOpen(!isEnrollModalOpen);

  const handleGradebookButton = () => {
    window.open(`${gradebookUrl}/${classId}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {!classInfo && (
        <Container size="xl" className="px-4 mt-3 page-content-container d-flex justify-content-center">
          <p>You must be an instructor in this class to see the information.</p>
        </Container>
      )}
      {classInfo && (
        <Container size="xl" className="px-4 mt-3">
          <div className="d-flex justify-content-between my-4 flex-column flex-sm-row">
            <div className="d-flex align-items-center mb-2">
              <Button onClick={handleBackButton} className="mr-3 link back-arrow" variant="tertiary">
                <i className="fa-solid fa-arrow-left" />
              </Button>
              <h3 className="h2 mb-0 course-title">Class details: {classNameDecoded}</h3>
            </div>
            <Button
              as="a"
              href={classLink}
              className="text-decoration-none text-white button-view-class"
            >
              <i className="fa-solid fa-arrow-up-right-from-square mr-2 mb-1" />
              View class
            </Button>
          </div>
          <InstructorCard />
          <div className="d-flex justify-content-end my-3 align-items-center ">
            <Button
              onClick={handleEnrollStudentModal}
              className="text-decoration-none text-primary bg-white"
            >
              Invite student to enroll
            </Button>
            <Dropdown className="dropdowntpz mx-3">
              <Dropdown.Toggle
                as={IconButton}
                src={MoreVert}
                iconAs={Icon}
                variant="primary"
                aria-label="More options"
              />
              <Dropdown.Menu align="right">
                <Dropdown.Item onClick={handleGradebookButton}>
                  <i className="fa-regular fa-book mr-3" />
                  Gradebook
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Table
            isLoading={isLoading}
            columns={COLUMNS}
            count={students.count}
            data={students.data}
            emptyText="No students found."
            rowClassName="my-4"
          />

          {students.numPages > 1 && (
            <Pagination
              paginationLabel="paginationNavigation"
              pageCount={students.numPages}
              currentPage={currentPage}
              onPageSelect={handlePagination}
              variant="reduced"
              className="mx-auto pagination-table"
              size="small"
            />
          )}
          <EnrollStudent
            isOpen={isEnrollModalOpen}
            onClose={handleEnrollStudentModal}
            className={classNameDecoded}
          />
        </Container>
      )}
    </>
  );
};

export default ClassDetailPage;
