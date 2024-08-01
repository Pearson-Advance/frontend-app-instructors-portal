import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Pagination } from '@edx/paragon';

import Table from 'features/Main/Table';

import { getClasses } from 'features/Classes/data';
import { resetClassesTable, updateCurrentPage } from 'features/Classes/data/slice';

import { columns } from 'features/Classes/ClassesPage/columns';
import { RequestStatus, initialPage } from 'features/constants';

const ClassesPage = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.classes.table);
  const instructorUserName = useSelector((state) => state.main.username);
  const COLUMNS = useMemo(() => columns, []);

  const [currentPage, setCurrentPage] = useState(initialPage);

  const isLoading = classes.status === RequestStatus.LOADING;

  useEffect(() => {
    if (instructorUserName) {
      dispatch(getClasses(instructorUserName, { page: currentPage, limit: true }));
    }

    return () => {
      dispatch(resetClassesTable());
    };
  }, [instructorUserName, dispatch, currentPage]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  return (
    <Container size="xl" className="px-4">
      <h3 className="title-page h2">Classes</h3>
      <section className="page-content-container">
        <Table
          isLoading={isLoading}
          columns={COLUMNS}
          count={classes.count}
          data={classes.data}
          emptyText="No classes found."
          rowClassName="justify-content-center my-4 my-3"
          colProps={{ xs: 11, className: 'px-0' }}
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
      </section>
    </Container>
  );
};

export default ClassesPage;
