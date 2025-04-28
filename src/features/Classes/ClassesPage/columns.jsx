/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatUTCDate } from 'react-paragon-topaz';
import { useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';

import { useInstitutionIdQueryParam } from 'hooks';

import EnrollStudent from 'features/Classes/EnrollStudent';
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
    Header: 'Institution',
    accessor: 'institutionName',
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
        className,
        classId,
        labSummaryUrl,
      } = row.original;

      const gradebookUrl = getConfig().GRADEBOOK_MICROFRONTEND_URL || getConfig().LMS_BASE_URL;
      const { hasEnrollmentPrivilege = false } = useSelector((state) => state.instructor.info);

      const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

      const handleGradebookButton = () => {
        const decodedClassId = decodeURIComponent(classId);
        window.open(`${gradebookUrl}/gradebook/${decodedClassId}`, '_blank', 'noopener,noreferrer');
      };

      const handleLabButton = () => {
        window.open(labSummaryUrl, '_blank', 'noopener,noreferrer');
      };

      const handleEnrollStudentModal = () => setIsEnrollModalOpen(!isEnrollModalOpen);

      const extraOptions = [
        {
          handleClick: handleGradebookButton,
          iconSrc: <i className="fa-regular fa-book mr-3" />,
          label: 'Gradebook',
          visible: true,
        },
        {
          handleClick: handleLabButton,
          iconSrc: <i className="fa-regular fa-rectangle-list mr-3" />,
          label: 'Lab summary',
          visible: !!labSummaryUrl,
        },
        {
          handleClick: handleEnrollStudentModal,
          iconSrc: <i className="fa-solid fa-user-plus mr-2" />,
          label: 'Enroll student',
          visible: hasEnrollmentPrivilege,
        },
      ];

      return (
        <>
          <EnrollStudent
            isOpen={isEnrollModalOpen}
            onClose={handleEnrollStudentModal}
            className={className}
            customClassId={classId}
          />
          <ActionsDropdown options={extraOptions} vertIcon={false} />
        </>
      );
    },
  },
];

export { columns };
