import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Button, CalendarExpanded, formatUTCDate } from 'react-paragon-topaz';

import AddEvent from 'features/Instructor/AddEvent';

import { fetchEventsData } from 'features/Instructor/data';
import { updateDatesCalendar } from 'features/Instructor/data/slice';
import { deleteEvent } from 'features/Instructor/data/api';

import 'features/Instructor/Availability/index.scss';
import { logError } from '@edx/frontend-platform/logging';

const initialState = {
  start_date: startOfMonth(new Date()).toISOString(),
  end_date: endOfMonth(new Date()).toISOString(),
};

const Availability = () => {
  const dispatch = useDispatch();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [rangeDates, setRangeDates] = useState(initialState);
  const events = useSelector((state) => state.instructor.events.data);
  const [eventsList, setEventsList] = useState([]);

  const handleAddEventModal = () => setIsAddEventOpen(!isAddEventOpen);

  const getRangeDate = useCallback((range) => {
    setRangeDates({
      start_date: range.start.toISOString(),
      end_date: range.end.toISOString(),
    });
  }, [setRangeDates]);

  const handleDeleteClass = async (event) => {
    try {
      await deleteEvent(event.id);
    } catch (error) {
      logError(error);
    } finally {
      dispatch(fetchEventsData(rangeDates));
    }
  };

  useEffect(() => {
    dispatch(fetchEventsData(rangeDates));
    dispatch(updateDatesCalendar(rangeDates));
  }, [rangeDates, dispatch]);

  useEffect(() => {
    if (events.length > 0) {
      const list = events.map(event => ({
        ...event,
        start: new Date(formatUTCDate(event.start)),
        end: new Date(formatUTCDate(event.end)),
      }));
      setEventsList(list);
    } else {
      setEventsList([]);
    }
  }, [events]);

  return (
    <article>
      <AddEvent
        isOpen={isAddEventOpen}
        onClose={handleAddEventModal}
      />
      <div className="d-flex justify-content-between align-items-baseline bg-primary px-3 py-2 rounded-top">
        <h4 className="text-white">Availability</h4>
        <Button variant="inverse-primary" onClick={handleAddEventModal}>
          <i className="fa-light fa-plus pr-2" />
          New event
        </Button>
      </div>
      <div className="p-3 bg-white mb-5 rounded-bottom container-calendar">
        <CalendarExpanded
          eventsList={eventsList}
          onRangeChange={getRangeDate}
          onDelete={handleDeleteClass}
        />
      </div>
    </article>
  );
};

export default Availability;
