/* eslint-disable react/prop-types */
import {
  ProgressBar,
  Dropdown,
  IconButton,
  Icon,
} from '@edx/paragon';
import { Link } from 'react-router-dom';
import { MoreHoriz } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';

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
  {
    Header: '',
    accessor: 'classId',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const { classId, userId } = row.original;
      const progressPageLink = `${getConfig().LEARNING_MICROFRONTEND_URL}/course/${classId}/progress/${userId}`;
      return (
        <Dropdown className="dropdowntpz">
          <Dropdown.Toggle
            id="dropdown-toggle-with-iconbutton"
            as={IconButton}
            src={MoreHoriz}
            iconAs={Icon}
            variant="primary"
            data-testid="droprown-action"
            alt="menu for actions"
          />
          <Dropdown.Menu>
            <Dropdown.Item
              target="_blank"
              rel="noreferrer"
              href={progressPageLink}
              className="text-truncate text-decoration-none custom-text-black"
            >
              <i className="fa-regular fa-bars-progress mr-2" />
              View progress
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    },
  },
];

export { columns };
