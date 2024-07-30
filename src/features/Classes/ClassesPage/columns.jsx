/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { formatUTCDate } from 'react-paragon-topaz';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => (
      <Link
        to={`/classes/${row.original.classId}?previous=classes`}
        className="text-truncate link"
      >
        {row.values.className}
      </Link>
    ),
  },
  {
    Header: 'Course',
    accessor: 'masterCourseName',
  },
  {
    Header: 'Start date',
    accessor: 'startDate',
    Cell: ({ row }) => {
      const startDate = row.original.startDate ? formatUTCDate(row.original.startDate, 'MM/dd/yy') : '-';
      return <span>{startDate}</span>;
    },
  },
  {
    Header: 'End date',
    accessor: 'endDate',
    Cell: ({ row }) => {
      const endDate = row.original.endDate ? formatUTCDate(row.original.endDate, 'MM/dd/yy') : '-';
      return <span>{endDate}</span>;
    },
  },
  {
    Header: 'Min',
    accessor: 'minStudentsAllowed',
  },
  {
    Header: 'Students enrolled',
    accessor: 'numberOfStudents',
  },
  {
    Header: 'Max',
    accessor: 'maxStudents',
  },
];

export { columns };
