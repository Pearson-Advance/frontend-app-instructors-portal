import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Form,
  Toast,
  Spinner,
  FormGroup,
  ModalDialog,
  ModalCloseButton,
} from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';

import { fetchStudentsData } from 'features/Students/data';
import { handleEnrollments, getMessages } from 'features/Classes/data/api';
import { fetchAllClassesData } from 'features/Common/data';
import { initialPage } from 'features/constants';
import { emailValidationMessages } from 'helpers';

import 'features/Classes/EnrollStudent/index.scss';

const EnrollStudent = ({ isOpen, onClose, className }) => {
  const dispatch = useDispatch();

  const { classId } = useParams();

  const username = useSelector((state) => state.main.username);

  const [showToast, setShowToast] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [studentIdentifiers, setStudentIdentifiers] = useState('');

  const isButtonDisabled = studentIdentifiers.trim() === '';

  const handleEnrollStudent = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    formData.delete('studentEmail');
    formData.append('identifiers', studentIdentifiers);
    formData.append('action', 'enroll');
    formData.append('auto_enroll', 'true');
    formData.append('email_students', 'true');

    try {
      setLoading(true);

      const response = await handleEnrollments(formData, classId);
      const validationEmailList = response?.data?.results;
      const messages = await getMessages();
      let textToast = '';

      /**
       * This is because the service that checks the enrollment status is a different
       * endpoint, and that endpoint always returns a status 200, so the error cannot be
       * caught with a .catch.
       */
      if (messages?.data?.results[0]?.tags === 'error') {
        setToastMessage(decodeURIComponent(messages?.data?.results[0]?.message));
        setShowToast(true);

        return onClose();
      }

      textToast = emailValidationMessages(validationEmailList);
      setToastMessage(textToast);

      const params = {
        class_name: className,
        limit: true,
        page: initialPage,
      };

      dispatch(fetchStudentsData(username, params));

      dispatch(fetchAllClassesData(username, { class_id: classId }));

      setShowToast(true);
      return onClose();
    } catch (error) {
      return logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStudentIdentifiers('');
    }
  }, [isOpen]);

  return (
    <>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        className="toast-message"
        data-testid="toast-message"
      >
        {toastMessage}
      </Toast>
      <ModalDialog
        title="Invite student to enroll"
        isOpen={isOpen}
        onClose={onClose}
        hasCloseButton
        className="enroll-modal"
      >
        <ModalDialog.Header>
          <ModalDialog.Title>Invite student to enroll</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body className="body-container h-100">
          <p className="text-uppercase font-weight-bold sub-title">
            Class: {className}
          </p>
          {isLoading && (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner
                animation="border"
                className="mie-3"
                screenReaderText="loading"
              />
            </div>
          )}
          {!isLoading && (
            <Form onSubmit={handleEnrollStudent}>
              <FormGroup controlId="studentInfo">
                <Form.Control
                  as="textarea"
                  placeholder="Enter email of the student to enroll"
                  floatingLabel="Email"
                  className="my-4 mr-0 student-email"
                  name="studentEmail"
                  required
                  autoResize
                  onChange={(e) => setStudentIdentifiers(e.target.value)}
                  value={studentIdentifiers}
                />
              </FormGroup>
              <div className="d-flex justify-content-end">
                <ModalCloseButton className="btntpz btn-text btn-tertiary mr-2">
                  Cancel
                </ModalCloseButton>
                <Button type="submit" disabled={isButtonDisabled}>Send invite</Button>
              </div>
            </Form>
          )}
        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

EnrollStudent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default EnrollStudent;
