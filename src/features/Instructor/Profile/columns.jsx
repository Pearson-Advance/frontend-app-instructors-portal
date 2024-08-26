/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, formatUTCDate } from 'react-paragon-topaz';

import { useInstitutionIdQueryParam } from 'hooks';
import { BADGE_VARIANTS } from 'features/constants';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => {
      const addQueryParam = useInstitutionIdQueryParam();

      return (
        <Link to={addQueryParam(`/classes/${row.original.classId}?previous=my-profile`)}>
          {row.values.className}
        </Link>
      );
    },
  },
  {
    Header: 'Course',
    accessor: 'masterCourseName',
    Cell: ({ row }) => (<span className="text-capitalize">{row.values.masterCourseName}</span>),
  },
  {
    Header: 'Start - End Date',
    accessor: 'startDate',
    Cell: ({ row }) => (
      <span className="text-capitalize">
        {formatUTCDate(row.values.startDate)}
        {row.original.endDate && ` - ${formatUTCDate(row.original.endDate)}`}
      </span>
    ),
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ row }) => (
      <Badge variant={BADGE_VARIANTS[row.values.status?.toLowerCase()] || 'success'} light className="text-capitalize">
        {row.values.status?.replace(/_/g, ' ')}
      </Badge>
    ),
  },
];

export { columns };
