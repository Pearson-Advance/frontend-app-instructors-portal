import React from 'react';
import { useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';

import { Container, Col, Row } from '@edx/paragon';
import WeeklySchedule from 'features/Dashboard/WeeklySchedule';

import 'features/Dashboard/DashboardPage/index.scss';

const DashboardPage = () => {
  const userName = useSelector((state) => state.main.username);
  const imageDashboard = getConfig().IMAGE_DASHBOARD_INSTRUCTORS_URL;

  return (
    <Container size="xl" className="px-4 pt-3">
      <h2 className="title-page mt-3 mb-3">
        {`Welcome ${userName}` }
      </h2>
      <Row className="schedule-section">
        <Col lg="9" xs="12">
          <WeeklySchedule />
        </Col>
        {imageDashboard && (
          <Col lg="3" xs="12">
            <div className="image-dashboard">
              <img src={imageDashboard} alt="" />
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default DashboardPage;
