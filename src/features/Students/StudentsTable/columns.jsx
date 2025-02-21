/* eslint-disable react/prop-types */
import { ProgressBar } from '@edx/paragon';
import { Link } from 'react-router-dom';

import { formatUTCDate } from 'react-paragon-topaz';
import { useInstitutionIdQueryParam } from 'hooks';

const columns = [
  {
    Header: 'Student',
    accessor: 'learnerName',
    Cell: ({ row }) => {
      const addQueryParam = useInstitutionIdQueryParam();
      const url = addQueryParam(`/students/${encodeURIComponent(row.original.learnerEmail)}?previous=students`);

      return (
        <Link
          to={url}
          className="text-truncate link"
        >
          {row.values.learnerName}
        </Link>
      );
    },
  },
  {
    Header: 'Email',
    accessor: 'learnerEmail',
    Cell: ({ row }) => (
      <a
        href={`mailto:${row.values.learnerEmail}`}
        className="link"
      >
        {row.values.learnerEmail}
      </a>
    ),
  },
  {
    Header: 'Institution',
    accessor: 'institutionName',
  },
  {
    Header: 'Class Name',
    accessor: 'className',
    Cell: ({ row }) => {
      const addQueryParam = useInstitutionIdQueryParam();
      const url = addQueryParam(`/classes/${row.original.classId}?previous=students`);

      return (
        <Link
          to={url}
          className="text-truncate link"
        >
          {row.values.className}
        </Link>
      );
    },
  },
  {
    Header: 'Start - End Date',
    accessor: 'startDate',
    Cell: ({ row }) => {
      const startDate = row.original.startDate ? formatUTCDate(row.original.startDate, 'MM/dd/yy') : '';
      const endDate = row.original.endDate ? formatUTCDate(row.original.endDate, 'MM/dd/yy') : '';
      return <div>{startDate} - {endDate}</div>;
    },
  },
  {
    Header: 'Progress',
    accessor: 'completePercentage',
    Cell: ({ row }) => (<ProgressBar now={row.values.completePercentage} variant="primary" />),
  },
  {
    Header: 'Exam Ready',
    accessor: 'examReady',
    Cell: ({ row }) => (row.values.examReady ? 'Yes' : 'No'),
  },
];

export { columns };
