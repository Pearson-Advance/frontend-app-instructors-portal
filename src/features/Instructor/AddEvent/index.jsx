import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Select, Button } from 'react-paragon-topaz';

import {
  ModalDialog, ModalCloseButton, Form, Col,
} from '@edx/paragon';

import { stylesSelectorNoBorders } from 'features/constants';

const initialStateModal = {
  type: 'not-available',
  allDay: true,
  repeat: { label: 'Does not repeat', value: 'not-repeat' },
  startDate: '',
  endDate: '',
  startHour: '',
  endHour: '',
};

const typeEventOptions = [
  { label: 'Not available', value: 'not-available' },
  { label: 'Available', value: 'available' },
  { label: 'Prep Time', value: 'prep-time' },
];

const repeatOptions = [
  { label: 'Does not repeat', value: 'not-repeat' },
  { label: 'Repeat weekly', value: 'weekly' },
  { label: 'Repeat monthly', value: 'monthly' },
];

const AddEvent = ({ isOpen, onClose }) => {
  const [eventData, setEventData] = useState(initialStateModal);

  const updateEventData = (key, value) => {
    setEventData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  const resetEventDataIfClosed = () => {
    setEventData(initialStateModal);
    onClose();
  };

  return (
    <ModalDialog
      title="New event"
      isOpen={isOpen}
      onClose={resetEventDataIfClosed}
      hasCloseButton
    >
      <ModalDialog.Header>
        <ModalDialog.Title>New Event</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form>
          <Form.Row className="col-12 px-0">
            <Form.Group>
              <Form.RadioSet
                name="event"
                className="d-flex align-items-end justify-content-between col-12 px-1"
                onChange={e => updateEventData('type', e.target.value)}
                isInline
                value={eventData.type}
              >
                {typeEventOptions.map(option => (
                  <Form.Radio value={option.value} key={option.value}>{option.label}</Form.Radio>
                ))}
              </Form.RadioSet>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group className="d-flex align-items-center justify-content-between col-12">
              <Form.Switch
                checked={eventData.allDay}
                onChange={e => updateEventData('allDay', e.target.checked)}
              >
                All day
              </Form.Switch>
              <Select
                name="repeat"
                options={repeatOptions}
                onChange={option => updateEventData('repeat', option)}
                value={eventData.repeat}
                styles={stylesSelectorNoBorders}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group className="d-flex align-items-end justify-content-between col-12">
              <Form.Control
                type="date"
                placeholder="Start date"
                floatingLabel="Start date"
                className="my-1 mr-0"
                name="start_date"
                required
                value={eventData.startDate}
                onChange={e => updateEventData('startDate', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="d-flex align-items-end justify-content-between col-12">
              <Form.Control
                type="date"
                placeholder="End date"
                floatingLabel="End date"
                className="my-1 mr-0"
                name="end_date"
                required
                value={eventData.endDate}
                onChange={e => updateEventData('endDate', e.target.value)}
              />
            </Form.Group>
          </Form.Row>
          {!eventData.allDay && (
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  type="time"
                  placeholder="From"
                  floatingLabel="From"
                  className="my-1 mr-0"
                  name="start_hour"
                  required
                  value={eventData.startHour}
                  onChange={e => updateEventData('startHour', e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  type="time"
                  placeholder="To"
                  floatingLabel="To"
                  className="my-1 mr-0"
                  name="end_hour"
                  value={eventData.endHour}
                  onChange={e => updateEventData('endHour', e.target.value)}
                />
              </Form.Group>
            </Form.Row>
          )}
          <div className="d-flex justify-content-end">
            <ModalCloseButton className="btntpz btn-text btn-tertiary mr-2">
              Discard
            </ModalCloseButton>
            <Button type="submit">Save</Button>
          </div>
        </Form>
      </ModalDialog.Body>
    </ModalDialog>
  );
};

AddEvent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddEvent;
