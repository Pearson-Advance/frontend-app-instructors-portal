import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startOfMonth, endOfMonth, endOfDay } from 'date-fns';
import { Button, CalendarExpanded, AddEventModal } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { fetchEventsData } from 'features/Instructor/data';
import { postInstructorEvent, deleteEvent } from 'features/Instructor/data/api';
import { updateDatesCalendar } from 'features/Instructor/data/slice';

import { setTimeInUTC, stringToDateType } from 'helpers';

import 'features/Instructor/Availability/index.scss';

const generateValueLabelPairs = (options) => options.reduce((accumulator, option) => {
  accumulator[option.value] = option.label;
  return accumulator;
}, {});

const typeEventOptions = [
  { label: 'Not available', value: 'not-available' },
  { label: 'Available', value: 'available' },
  { label: 'Prep Time', value: 'prep-time' },
];

const initialState = {
  start_date: startOfMonth(new Date()).toISOString(),
  end_date: endOfMonth(new Date()).toISOString(),
};

const eventTitles = generateValueLabelPairs(typeEventOptions);

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

  const handleSaveEvent = async (eventData) => {
    try {
      const eventDataRequest = {
        title: eventTitles[eventData.type || 'available'],
        availability: Object.entries(eventTitles).find(([, value]) => value === eventTitles[eventData.type || 'available'])?.[0],
        start: setTimeInUTC(stringToDateType(eventData.startDate), eventData.startHour),
        end: setTimeInUTC(stringToDateType(eventData.endDate), eventData.endHour),
        repeat: eventData.repeat.value,
      };
      await postInstructorEvent(eventDataRequest);
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
      const list = events.map(event => {
        let endDate = new Date(event.end);

        if (endDate.getHours() < 1 && endDate.getMinutes() < 1) {
          endDate = endOfDay(endDate);
        }

        return {
          ...event,
          start: new Date(event.start),
          end: endDate,
        };
      });
      setEventsList(list);
    } else {
      setEventsList([]);
    }
  }, [events]);

  return (
    <article>
      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={handleAddEventModal}
        onSave={handleSaveEvent}
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
