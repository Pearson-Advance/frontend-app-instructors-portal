import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Col } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';

import ClassCard from 'features/Dashboard/AssignedClasses/ClassCard';

import 'features/Dashboard/AssignedClasses/index.scss';

const AssignedClasses = () => {
  const classes = useSelector((state) => state.common.allClasses.data);
  const [classCards, setClassCards] = useState([]);
  const displayClassLimit = 3;

  useEffect(() => {
    // Display only the first 'displayClassLimit' on the homepage.
    if (classes.length > displayClassLimit) {
      setClassCards(classes.slice(0, displayClassLimit));
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
      {classes.length > displayClassLimit && (
        <div className="d-flex justify-content-center">
          <Button text className="view-all-btn" disabled>View all</Button>
        </div>
      )}
      {classes.length === 0 && (
      <p className="empty-content">No classes found</p>
      )}
    </Col>
  );
};

export default AssignedClasses;
