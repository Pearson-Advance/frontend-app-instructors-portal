import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Schedule } from 'react-paragon-topaz';

import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

import { fetchAllClassesData } from 'features/Common/data';

import { formatDateRange } from 'helpers';
import 'features/Dashboard/WeeklySchedule/index.scss';

const WeeklySchedule = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.main.username);
  const classesData = useSelector((state) => state.common.allClasses.data);
  const [classList, setClassList] = useState([]);
  const startCurrentWeek = startOfWeek(new Date());
  const endCurrentWeek = endOfWeek(new Date());
  const [stateDate, setStateDate] = useState([
    {
      startDate: startCurrentWeek,
      endDate: endCurrentWeek,
      key: 'selection',
      color: '#e4faff',
    },
  ]);

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
      dispatch(fetchAllClassesData(username));
    }
  }, [username, dispatch]);

  useEffect(() => {
    // Display only the classes which the start date is in the selected time period
    if (classesData.length > 0) {
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
    } else {
      setClassList([]);
    }
  }, [classesData, stateDate]);

  return (
    <>
      <div className="header-schedule">
        <h3>Class schedule</h3>
      </div>
      <div className="content-schedule d-flex justify-content-between">
        <div className="container-class-schedule">
          {classList.length > 0 ? (
            classList.map(classInfo => (
              <div className="class-schedule" key={classInfo?.classId}>
                <div className="class-text">
                  <p className="class-name">{classInfo?.className}</p>
                  <p className="class-master-course">{classInfo?.masterCourseName}</p>
                  <p className="class-descr">
                    <i className="fa-sharp fa-regular fa-calendar-day" />
                    {formatDateRange(classInfo?.startDate, classInfo?.endDate)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-classes">No classes scheduled at this time</div>
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
