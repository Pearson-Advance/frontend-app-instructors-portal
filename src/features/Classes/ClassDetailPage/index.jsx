import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';

import Table from 'features/Main/Table';
import { Button } from 'react-paragon-topaz';
import { Container, Pagination } from '@edx/paragon';

import { fetchStudentsData } from 'features/Students/data';
import { resetStudentsTable, updateCurrentPage } from 'features/Students/data/slice';
import { updateActiveTab } from 'features/Main/data/slice';

import { columns } from 'features/Classes/ClassDetailPage/columns';
import { RequestStatus, initialPage } from 'features/constants';

const ClassDetailPage = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { className } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const previousPage = queryParams.get('previous') || 'classes';
  const students = useSelector((state) => state.students.table);
  const username = useSelector((state) => state.main.username);
  const COLUMNS = useMemo(() => columns, []);

  const [currentPage, setCurrentPage] = useState(initialPage);

  const isLoading = students.status === RequestStatus.LOADING;
  const classNameDecoded = decodeURIComponent(className);

  useEffect(() => {
    if (username) {
      const params = {
        page: currentPage,
        class_name: classNameDecoded,
      };
      // Leaves a gap time space to prevent being override by ActiveTabUpdater component
      setTimeout(() => dispatch(updateActiveTab(previousPage)), 100);
      dispatch(fetchStudentsData(username, params));
    }

    return () => {
      dispatch(resetStudentsTable());
    };
  }, [username, dispatch, currentPage, classNameDecoded, previousPage]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  const handleBackButton = () => (previousPage ? history.push(`/${previousPage}`) : history.push('/classes'));

  return (
    <Container size="xl" className="px-4 mt-3">
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <div className="d-flex align-items-center mb-3">
          <Button onClick={handleBackButton} className="mr-3 link back-arrow" variant="tertiary">
            <i className="fa-solid fa-arrow-left" />
          </Button>
          <h3 className="h2 mb-0 course-title">Class details: {classNameDecoded}</h3>
        </div>
      </div>
      <Table
        isLoading={isLoading}
        columns={COLUMNS}
        count={students.count}
        data={students.data}
        emptyText="No students found."
        rowClassName="justify-content-center my-4 my-3"
        colProps={{ xs: 11, className: 'px-0' }}
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
    </Container>
  );
};

export default ClassDetailPage;
