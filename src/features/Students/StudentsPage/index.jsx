import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Pagination,
} from '@edx/paragon';

import { fetchStudentsData } from 'features/Students/data';
import { resetStudentsTable, updateCurrentPage } from 'features/Students/data/slice';

import StudentsTable from 'features/Students/StudentsTable';
import StudentsFilters from 'features/Students/StudentsFilters';

import { initialPage } from 'features/constants';

const StudentsPage = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.main.username);
  const filters = useSelector((state) => state.students.filters);
  const students = useSelector((state) => state.students);
  const institution = useSelector((state) => state.main.institution);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (username) {
      dispatch(fetchStudentsData(username, {
        page: currentPage,
        institution_id: institution?.id,
        limit: true,
        ...filters,
      }));
    }

    return () => {
      dispatch(resetStudentsTable());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, dispatch, currentPage, institution]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  return (
    <Container size="xl" className="px-4">
      <h2 className="title-page">Students</h2>
      <div className="page-content-container">
        <StudentsFilters />
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
