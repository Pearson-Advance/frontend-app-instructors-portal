/* eslint-disable react/prop-types */
import { ProgressBar } from '@edx/paragon';
import { Link } from 'react-router-dom';
import { formatUTCDate } from 'react-paragon-topaz';

const columns = [
  {
    Header: 'Student',
    accessor: 'learnerName',
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
    Header: 'Class Name',
    accessor: 'className',
    Cell: ({ row }) => (
      <Link
        to="/"
        className="text-truncate link"
      >
        {row.values.className}
      </Link>
    ),
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
    Cell: ({ row }) => (row.values.examReady ? 'yes' : 'no'),
  },
];

export { columns };