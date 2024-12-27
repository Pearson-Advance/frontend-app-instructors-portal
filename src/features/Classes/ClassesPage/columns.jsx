/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { formatUTCDate } from 'react-paragon-topaz';
import { getConfig } from '@edx/frontend-platform';

import { useInstitutionIdQueryParam } from 'hooks';
import ActionsDropdown from 'features/Main/ActionsDropdown';

const columns = [
  {
    Header: 'Class',
    accessor: 'className',
    Cell: ({ row }) => {
      const addQueryParam = useInstitutionIdQueryParam();
      const url = addQueryParam(`/classes/${row.original.classId}?previous=classes`);

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
  {
    Header: '',
    accessor: 'courseName',
    cellClassName: 'dropdownColumn',
    disableSortBy: true,
    Cell: ({ row }) => {
      const {
        classId,
      } = row.original;

      const gradebookUrl = getConfig().GRADEBOOK_MICROFRONTEND_URL || getConfig().LMS_BASE_URL;

      const handleGradebookButton = () => {
        const decodedClassId = decodeURIComponent(classId);
        window.open(`${gradebookUrl}/gradebook/${decodedClassId}`, '_blank', 'noopener,noreferrer');
      };
      const extraOptions = [
        {
          handleClick: handleGradebookButton,
          iconSrc: <i className="fa-regular fa-book mr-3" />,
          label: 'Gradebook',
        },
      ];

      return <ActionsDropdown options={extraOptions} vertIcon={false} />;
    },
  },
];

export { columns };
