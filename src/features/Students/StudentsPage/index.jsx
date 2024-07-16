import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Container, Pagination } from '@edx/paragon';

import { fetchStudentsData } from 'features/Students/data';
import { resetStudentsTable, updateCurrentPage } from 'features/Students/data/slice';

import StudentsTable from 'features/Students/StudentsTable';

import { initialPage } from 'features/constants';

const StudentsPage = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.main.username);
  const students = useSelector((state) => state.students);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (username) {
      dispatch(fetchStudentsData(username, { page: currentPage }));
    }

    return () => {
      dispatch(resetStudentsTable());
    };
  }, [username, dispatch, currentPage]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">Students</h2>
      <div className="page-content-container">
        <StudentsTable />
        {students.table.numPages > 1 && (
          <Pagination
            paginationLabel="paginationNavigation"
            pageCount={students.table.numPages}
            currentPage={currentPage}
            onPageSelect={handlePagination}
            variant="reduced"
            className="mx-auto pagination-table"
            size="small"
          />
        )}
      </div>
    </Container>
  );
};

export default StudentsPage;
