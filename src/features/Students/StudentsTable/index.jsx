import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import DataTable from '@edx/paragon/dist/DataTable';
import {
  Row,
  Col,
} from '@edx/paragon';

import { columns } from 'features/Students/StudentsTable/columns';
import { RequestStatus } from 'features/constants';

const StudentsTable = () => {
  const students = useSelector((state) => state.students.table);
  const COLUMNS = useMemo(() => columns, []);
  const isLoading = students.status === RequestStatus.LOADING;

  return (
    <Row className="justify-content-center my-4 my-3">
      <Col xs={11} className="p-0">
        <DataTable
          isLoading={isLoading}
          isSortable
          itemCount={students.count}
          data={students.data}
          columns={COLUMNS}
        >
          <DataTable.Table />
          <DataTable.EmptyTable content="No students found." />
          <DataTable.TableFooter />
        </DataTable>
      </Col>
    </Row>
  );
};

export default StudentsTable;
