import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  DataTable,
} from '@openedx/paragon';

import 'features/Main/Table/index.scss';

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
        <div className="responsive-data-table">
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
        </div>
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
