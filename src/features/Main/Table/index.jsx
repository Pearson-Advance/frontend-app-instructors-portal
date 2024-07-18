import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  DataTable,
} from '@edx/paragon';

const Table = ({
  columns,
  data,
  count,
  emptyText,
  rowClassName,
  colProps,
  ...props
}) => {
  const COLUMNS = useMemo(() => columns, [columns]);

  return (
    <Row className={rowClassName}>
      <Col {...colProps}>
        <DataTable
          isSortable
          columns={COLUMNS}
          itemCount={count}
          data={data}
          {...props}
        >
          <DataTable.Table />
          <DataTable.EmptyTable content={emptyText} />
          <DataTable.TableFooter />
        </DataTable>
      </Col>
    </Row>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape([])).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape([])),
  count: PropTypes.number,
  emptyText: PropTypes.string.isRequired,
  rowClassName: PropTypes.string,
  colProps: PropTypes.shape({
    className: PropTypes.string,
  }),
};

Table.defaultProps = {
  data: [],
  count: 0,
  rowClassName: '',
  colProps: {
    className: '',
  },
};

export default Table;
