import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startOfMonth, endOfMonth, endOfDay } from 'date-fns';
import { Button, CalendarExpanded, AddEventModal } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { fetchEventsData } from 'features/Instructor/data';
import { postInstructorEvent, deleteEvent, editEvent } from 'features/Instructor/data/api';
import { updateDatesCalendar, updateEvents } from 'features/Instructor/data/slice';

import { setTimeInUTC, stringToDateType } from 'helpers';

import 'features/Instructor/Availability/index.scss';

const initialState = {
  start_date: startOfMonth(new Date()).toISOString(),
  end_date: endOfMonth(new Date()).toISOString(),
};

const Availability = () => {
  const dispatch = useDispatch();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [rangeDates, setRangeDates] = useState(initialState);
  const events = useSelector((state) => state.instructor.events.data);
  const institution = useSelector((state) => state.main.institution);

  const [eventsList, setEventsList] = useState([]);

  const handleAddEventModal = () => setIsAddEventOpen(!isAddEventOpen);

  const getRangeDate = useCallback((range) => {
    setRangeDates({
      start_date: range.start.toISOString(),
      end_date: range.end.toISOString(),
    });
  }, [setRangeDates]);

  /**
   * Edit multiple recurrences or create a new event depending on the situation.
   *
   * @param {Object} eventData
   * @param {Boolean} isEdit
   */
  const processAndSubmitEvent = async (eventData, isEdit = false) => {
    try {
      const endTypeDate = stringToDateType(eventData.endDate);
      const endRecurrenceTypeDate = stringToDateType(eventData.endDateRecurrence);
      const isValidRecurrence = endRecurrenceTypeDate instanceof Date && !Number.isNaN(endRecurrenceTypeDate.getTime());

      let eventDataRequest = {
        title: eventData.title,
        start: setTimeInUTC(stringToDateType(eventData.startDate), eventData.startHour),
        end: setTimeInUTC(endOfDay(endTypeDate), eventData.endHour),
        recurrence: eventData.recurrence.value,
        recurrence_end: isValidRecurrence ? setTimeInUTC(endOfDay(endRecurrenceTypeDate)) : '',
      };

      if (isEdit) {
        eventDataRequest = {
          ...eventDataRequest,
          event_id: eventData.id,
        };

        await editEvent(eventDataRequest);

        dispatch(fetchEventsData({ ...rangeDates, institution_id: institution?.id }));
      } else {
        const { data: newEvent } = await postInstructorEvent(eventDataRequest);
        dispatch(updateEvents([...events, newEvent]));

        if (eventDataRequest.recurrence) {
          dispatch(fetchEventsData({ ...rangeDates, institution_id: institution?.id }, events));
        }
      }
    } catch (error) {
      logError(error);
    }
  };

  const handleEditSingleRecurrence = async (eventData) => {
    try {
      const endTypeDate = stringToDateType(eventData.endDate);
      const eventDataRequest = {
        title: eventData.title,
        start: setTimeInUTC(stringToDateType(eventData.startDate), eventData.startHour),
        end: setTimeInUTC(endOfDay(endTypeDate), eventData.endHour),
        recurrence: eventData.recurrence.value,
        event_id: eventData.id,
        edit_occurrence: true,
        original_start: setTimeInUTC(eventData?.originalStart),
      };

      await editEvent(eventDataRequest);
      const newEventsState = events?.map(currentEvent => (
        currentEvent.elementId === eventData.elementId
          ? { ...currentEvent, ...eventDataRequest } : currentEvent
      ));
      dispatch(updateEvents(newEventsState));
    } catch (error) {
      logError(error);
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      const params = event?.recurrence ? {
        delete_occurrence: true,
        start_occurrence: event?.start,
      } : {};

      await deleteEvent(event.id, params);

      const newEventsState = events.filter(currentEvent => currentEvent.elementId !== event.elementId);
      dispatch(updateEvents(newEventsState));
    } catch (error) {
      logError(error);
    }
  };

  const handleDeleteMultipleEvents = async (event) => {
    try {
      await deleteEvent(event.id);
      const newEventsState = events.filter(currentEvent => currentEvent.id !== event.id);
      dispatch(updateEvents(newEventsState));
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    const params = {
      institution_id: institution?.id,
      ...rangeDates,
    };
    dispatch(fetchEventsData(params));
    dispatch(updateDatesCalendar(rangeDates));
  }, [rangeDates, dispatch, institution]);

  useEffect(() => {
    if (events.length > 0) {
      const list = events?.map(event => ({
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
        onSave={processAndSubmitEvent}
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
          onEdit={(eventData) => processAndSubmitEvent(eventData, true)}
          onDelete={handleDeleteEvent}
          onDeleteMultiple={handleDeleteMultipleEvents}
          onEditSinglRec={handleEditSingleRecurrence}
        />
      </div>
    </article>
  );
};

export default Availability;
