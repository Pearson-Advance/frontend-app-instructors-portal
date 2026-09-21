import React, { useMemo, useState } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  const hasActionColumn = useMemo(
    () => columns.some((col) => col?.cellClassName?.includes('dropdownColumn')),
    [columns],
  );

  const tableClassName = [
    'responsive-data-table',
    hasActionColumn && 'responsive-data-table--sticky',
    isScrolled && 'is-scrolled',
  ].filter(Boolean).join(' ');

  return (
    <Row className={rowClassName}>
      <Col {...colProps}>
        <div className="table-wrapper-fix">
          <div className={tableClassName} onScroll={(e) => setIsScrolled(e.currentTarget.scrollLeft > 0)}>
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
