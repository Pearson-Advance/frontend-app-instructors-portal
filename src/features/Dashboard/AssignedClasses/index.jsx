import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Col } from '@edx/paragon';

import { CLASS_LIMIT } from 'features/constants';
import { useInstitutionIdQueryParam } from 'hooks';
import ClassCard from 'features/Dashboard/AssignedClasses/ClassCard';

import 'features/Dashboard/AssignedClasses/index.scss';

const AssignedClasses = () => {
  const classes = useSelector((state) => state.common.allClasses.data);
  const [classCards, setClassCards] = useState([]);

  const addQueryParam = useInstitutionIdQueryParam();
  const url = addQueryParam('/classes');

  useEffect(() => {
    // Display only the first 'displayClassLimit' on the homepage.
    if (classes.length > CLASS_LIMIT) {
      setClassCards(classes.slice(0, CLASS_LIMIT));
    } else {
      setClassCards(classes);
    }
  }, [classes]);

  return (
    <Col xs={12} className="assigned-classes-container my-4 p-0">
      <h4 className="title-instr-assign">Assigned Classes</h4>
      <div className="d-flex cards-container">
        {classCards.map(classInfo => <ClassCard data={classInfo} key={classInfo?.classId} />)}
      </div>
      {classes.length > CLASS_LIMIT && (
        <div className="d-flex justify-content-center">
          <Link
            className="link p-3"
            to={url}
          >
            View all
          </Link>
        </div>
      )}
      {classes.length === 0 && (
      <p className="empty-content">No classes found</p>
      )}
    </Col>
  );
};

export default AssignedClasses;
