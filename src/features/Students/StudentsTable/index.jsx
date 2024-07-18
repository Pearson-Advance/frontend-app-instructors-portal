import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import Table from 'features/Main/Table';

import { columns } from 'features/Students/StudentsTable/columns';
import { RequestStatus } from 'features/constants';

const StudentsTable = () => {
  const students = useSelector((state) => state.students.table);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = students.status === RequestStatus.LOADING;

  return (
    <Table
      isLoading={isLoading}
      columns={COLUMNS}
      count={students.count}
      data={students.data}
      emptyText="No students found."
      rowClassName="justify-content-center my-4 my-3"
      colProps={{ xs: 11, className: 'px-0' }}
    />
  );
};

export default StudentsTable;
