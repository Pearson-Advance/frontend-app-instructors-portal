import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Pagination } from '@edx/paragon';

import Table from 'features/Main/Table';
import ClassesFilters from 'features/Classes/ClassesFilters';

import { getClasses } from 'features/Classes/data';
import { resetClassesTable, updateCurrentPage } from 'features/Classes/data/slice';

import { columns } from 'features/Classes/ClassesPage/columns';
import { RequestStatus, initialPage } from 'features/constants';

const ClassesPage = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.classes.table);
  const institution = useSelector((state) => state.main.institution);
  const instructorUserName = useSelector((state) => state.main.username);
  const filters = useSelector((state) => state.classes.filters);
  const COLUMNS = useMemo(() => columns, []);

  const [currentPage, setCurrentPage] = useState(initialPage);

  const isLoading = classes.status === RequestStatus.LOADING;

  useEffect(() => {
    if (instructorUserName && institution?.id) {
      dispatch(getClasses(instructorUserName, {
        page: currentPage,
        limit: true,
        institution_id: institution?.id,
        ...filters,
      }));
    }

    return () => {
      dispatch(resetClassesTable());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructorUserName, dispatch, currentPage, institution]);

  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    dispatch(updateCurrentPage(targetPage));
  };

  return (
    <Container size="xl" className="px-4">
      <h3 className="title-page h2">Classes</h3>
      <section className="page-content-container">
        <ClassesFilters />
        <Table
          isLoading={isLoading}
          columns={COLUMNS}
          count={classes.count}
          data={classes.data}
          emptyText="No classes found."
          rowClassName="justify-content-center my-4 my-3 mx-0"
          colProps={{ xs: 12, className: 'px-4' }}
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
