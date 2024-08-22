import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Schedule, formatDateRange } from 'react-paragon-topaz';

import { useInstitutionIdQueryParam } from 'hooks';
import { fetchAllClassesData } from 'features/Common/data';

import 'features/Dashboard/WeeklySchedule/index.scss';

const WeeklySchedule = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.main.username);
  const classesData = useSelector((state) => state.common.allClasses.data);
  const institution = useSelector((state) => state.main.institution);
  const [classList, setClassList] = useState([]);
  const [stateDate, setStateDate] = useState([
    {
      startDate: startOfWeek(new Date()),
      endDate: endOfWeek(new Date()),
      key: 'selection',
      color: '#e4faff',
    },
  ]);

  const addQueryParam = useInstitutionIdQueryParam();

  const handleDateChange = (date) => {
    const startWeekSelected = startOfWeek(date);
    const endWeekSelected = endOfWeek(date);
    const newStateSelected = [{
      startDate: startWeekSelected,
      endDate: endWeekSelected,
      key: 'selection',
    }];
    setStateDate(newStateSelected);
  };

  useEffect(() => {
    if (username) {
      dispatch(fetchAllClassesData(username, { institution_id: institution?.id }));
    }
  }, [username, dispatch, institution]);

  useEffect(() => {
    // Display only the classes which the start date is in the selected time period
    if (!classesData.length > 0) {
      setClassList([]);
    }

    const classListDisplay = classesData.filter(classItem => {
      const startDateClass = new Date(classItem.startDate);
      const startWeekSelected = stateDate[0].startDate;
      const endWeekSelected = stateDate[0].endDate;
      return isWithinInterval(startDateClass, {
        start: startWeekSelected,
        end: endWeekSelected,
      });
    });
    setClassList(classListDisplay);
  }, [classesData, stateDate]);

  return (
    <>
      <div className="header-schedule">
        <h3>Class schedule</h3>
      </div>
      <div className="content-schedule d-flex justify-content-between">
        <div className="container-class-schedule">
          {classList.length > 0 ? (
            classList.map(classInfo => {
              const url = addQueryParam(`/classes/${classInfo?.classId}?previous=dashboard`);

              return (
                <div className="class-schedule" key={classInfo?.classId}>
                  <div className="class-text">
                    <Link
                      className="class-name"
                      to={url}
                    >
                      {classInfo?.className}
                    </Link>
                    <p className="class-master-course">{classInfo?.masterCourseName}</p>
                    <p className="class-descr">
                      <i className="fa-sharp fa-regular fa-calendar-day" />
                      {formatDateRange(classInfo?.startDate, classInfo?.endDate)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="empty-classes">No classes scheduled at this time</p>
          )}
        </div>
        <Schedule
          onChange={item => handleDateChange(item)}
          showDateDisplay={false}
          ranges={stateDate}
          direction="horizontal"
          rangeColors={['#e4faff']}
          fixedHeigh
          showMonthName={false}
          isWeekRange
        />
      </div>
    </>
  );
};

export default WeeklySchedule;
