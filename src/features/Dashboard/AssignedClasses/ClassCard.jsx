import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col } from '@edx/paragon';

import { formatDateRange } from 'react-paragon-topaz';

import { useInstitutionIdQueryParam } from 'hooks';

const ClassCard = ({ data }) => {
  const addQueryParam = useInstitutionIdQueryParam();
  const url = addQueryParam(`/classes/${data?.classId}?previous=dashboard`);

  return (
    <Col sm={12} md={4} className="class-card-container px-4 py-3 ">
      <Link className="h4 link" to={url}>{data?.className}</Link>
      <p className="course-name">{data?.masterCourseName}</p>
      <p className="date">
        <i className="fa-sharp fa-regular fa-calendar-day" />
        {formatDateRange(data.startDate, data?.endDate)}
      </p>
    </Col>
  );
};

ClassCard.propTypes = {
  data: PropTypes.shape({
    classId: PropTypes.string,
    className: PropTypes.string,
    masterCourseName: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
};

ClassCard.defaultProps = {
  data: {},
};

export default ClassCard;
