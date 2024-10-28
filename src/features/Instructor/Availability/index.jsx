import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startOfMonth, endOfMonth, endOfDay } from 'date-fns';
import { Button, CalendarExpanded, AddEventModal } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { fetchEventsData } from 'features/Instructor/data';
import { postInstructorEvent, deleteEvent, editEvent } from 'features/Instructor/data/api';
import { updateDatesCalendar } from 'features/Instructor/data/slice';

import { setTimeInUTC, stringToDateType } from 'helpers';
import { AVAILABILITY_VALUES } from 'features/constants';

import 'features/Instructor/Availability/index.scss';

const generateValueLabelPairs = (options) => options.reduce((accumulator, option) => {
  accumulator[option.value] = option.label;
  return accumulator;
}, {});

const typeEventOptions = [
  { label: 'Not available', value: AVAILABILITY_VALUES.notAvailable },
  { label: 'Available', value: AVAILABILITY_VALUES.available },
  { label: 'Prep Time', value: AVAILABILITY_VALUES.prepTime },
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

  const handleDeleteEvent = async (event) => {
    try {
      const params = event?.recurrence ? {
        delete_occurrence: true,
        start_occurrence: event?.start,
      } : {};

      await deleteEvent(event.id, params);
    } catch (error) {
      logError(error);
    } finally {
      dispatch(fetchEventsData(rangeDates));
    }
  };

  const handleDeleteMultipleEvents = async (event) => {
    try {
      await deleteEvent(event.id);
    } catch (error) {
      logError(error);
    } finally {
      dispatch(fetchEventsData(rangeDates));
    }
  };

  const handleEvent = async (eventData, isEdit = false) => {
    try {
      const endTypeDate = stringToDateType(eventData.endDate);
      let eventDataRequest = {
        title: eventTitles[eventData.availability || 'available'],
        availability: eventData.availability || 'available',
        start: setTimeInUTC(stringToDateType(eventData.startDate), eventData.startHour),
        end: setTimeInUTC(endOfDay(endTypeDate), eventData.endHour),
        recurrence: eventData.recurrence.value,
      };

      if (isEdit) {
        eventDataRequest = {
          ...eventDataRequest,
          event_id: eventData.id,
        };
        await editEvent(eventDataRequest);
      } else {
        await postInstructorEvent(eventDataRequest);
      }
    } catch (error) {
      logError(error);
    } finally {
      dispatch(fetchEventsData(rangeDates));
    }
  };

  const handleEditSingleRecurrence = async (eventData) => {
    try {
      const endTypeDate = stringToDateType(eventData.endDate);
      const eventDataRequest = {
        title: eventTitles[eventData.availability || 'available'],
        availability: eventData.availability || 'available',
        start: setTimeInUTC(stringToDateType(eventData.startDate), eventData.startHour),
        end: setTimeInUTC(endOfDay(endTypeDate), eventData.endHour),
        recurrence: eventData.recurrence.value,
        event_id: eventData.id,
        edit_occurrence: true,
        original_start: setTimeInUTC(eventData?.originalStart),
      };

      await editEvent(eventDataRequest);
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
        start: new Date(event.start),
        end: new Date(event.end),
      }));
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
        onSave={handleEvent}
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
          onEdit={(eventData) => handleEvent(eventData, true)}
          onDelete={handleDeleteEvent}
          onDeleteMultiple={handleDeleteMultipleEvents}
          onEditSinglRec={handleEditSingleRecurrence}
        />
      </div>
    </article>
  );
};

export default Availability;
