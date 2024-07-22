import React from 'react';
import PropTypes from 'prop-types';

import { Col } from '@edx/paragon';

import { formatDateRange } from 'react-paragon-topaz';

const ClassCard = ({ data }) => (
  <Col sm={12} md={4} className="class-card-container px-4 py-3 ">
    <h4>{data?.className}</h4>
    <p className="course-name">{data?.masterCourseName}</p>
    <p className="date"><i className="fa-sharp fa-regular fa-calendar-day" />{formatDateRange(data.startDate, data?.endDate)}</p>
  </Col>
);

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
