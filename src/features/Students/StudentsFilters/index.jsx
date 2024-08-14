import React, { useEffect, useState } from 'react';
import {
  Form,
  Col,
  Icon,
} from '@edx/paragon';
import { Search } from '@edx/paragon/icons';
import { Select, Button } from 'react-paragon-topaz';
import { useDispatch, useSelector } from 'react-redux';

import { fetchStudentsData } from 'features/Students/data';
import { updateFilters } from 'features/Students/data/slice';
import { fetchAllCourses, fetchAllClassesData } from 'features/Common/data';

import { RequestStatus } from 'features/constants';

const examReadyOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

const initialStudentState = {
  checkboxSelection: 'name',
  inputValue: '',
  course: null,
  class: null,
  isExamReady: null,
};

const StudentsFilters = () => {
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.students.filters);
  const institution = useSelector((state) => state.main.institution);
  const instructorUserName = useSelector((state) => state.main.username);

  const isCoursesLoading = useSelector((state) => state.common.allCourses.status) === RequestStatus.LOADING;
  const isClassesLoading = useSelector((state) => state.common.allClasses.status) === RequestStatus.LOADING;

  const courses = useSelector((state) => state.common.allCourses.data)
    .map((course) => ({ label: course.masterCourseName, value: course.masterCourseName }));
  const classes = useSelector((state) => state.common.allClasses.data)
    .map((classElement) => ({ label: classElement.className, value: classElement.className }));

  const [studentsData, setStudentsData] = useState({
    ...initialStudentState,
    checkboxSelection: (filters?.learner_name && 'name') || (filters?.learner_email && 'email') || 'name',
    course: courses?.find((courseElement) => courseElement.value === filters?.course_name) || null,
    class: classes?.find((classElement) => classElement.value === filters?.class_name) || null,
    inputValue: filters?.learner_name || filters?.learner_email || '',
    isExamReady: examReadyOptions.find((option) => option.value === filters?.exam_ready) || null,
  });

  const isButtonDisabled = studentsData.inputValue === '' && studentsData.course === null && studentsData.isExamReady === null;

  const handleStudentsFilter = (event) => {
    event.preventDefault();

    if (isButtonDisabled) { return; }

    const studentQueryKey = {
      name: 'learner_name',
      email: 'learner_email',
    };

    const filterOptions = {
      [studentQueryKey[studentsData.checkboxSelection]]: studentsData.inputValue,
      course_name: studentsData.course?.value,
      class_name: studentsData.class?.value,
      exam_ready: studentsData.isExamReady?.value,
      institution_id: institution?.id,
    };

    dispatch(updateFilters(filterOptions));
    dispatch(fetchStudentsData(instructorUserName, filterOptions));
  };

  const resetFilters = () => {
    if (isButtonDisabled) { return; }

    dispatch(updateFilters({}));
    setStudentsData(initialStudentState);
    dispatch(fetchStudentsData(instructorUserName, { institution_id: institution?.id }));
  };

  useEffect(() => {
    if (instructorUserName) {
      dispatch(fetchAllCourses(instructorUserName, { institution_id: institution?.id }));
    }
  }, [dispatch, instructorUserName, institution]);

  useEffect(() => {
    if (instructorUserName && studentsData.course) {
      const options = {
        course_name: studentsData.course.value,
        institution_id: institution?.id,
      };

      dispatch(fetchAllClassesData(instructorUserName, options));
    }
  }, [dispatch, instructorUserName, studentsData.course, institution]);

  return (
    <section className="px-4">
      <h3 className="mb-3 pb-1 pl-4">Search</h3>
      <Form className="row justify-content-end col-13 mx-1" onSubmit={handleStudentsFilter}>
        <Form.Row className="col-12">
          <Form.Group>
            <Form.RadioSet
              name="inputField"
              className="d-flex align-items-end justify-content-between col-12 px-1"
              onChange={(e) => setStudentsData({ ...studentsData, checkboxSelection: e.target.value })}
              isInline
              value={studentsData.checkboxSelection}
            >
              <Form.Radio value="name">Student name</Form.Radio>
              <Form.Radio value="email" data-testid="emailCheckbox">Student email</Form.Radio>
            </Form.RadioSet>
          </Form.Group>
        </Form.Row>
        <Form.Row className="col-12">
          <Form.Group as={Col}>
            <Form.Control
              type={`${studentsData.checkboxSelection === 'name' ? 'text' : 'email'}`}
              floatingLabel={`Student ${studentsData.checkboxSelection === 'name' ? 'name' : 'email'}`}
              name="instructor_name"
              placeholder={`Student ${studentsData.checkboxSelection === 'name' ? 'name' : 'email'}`}
              onChange={(e) => setStudentsData({ ...studentsData, inputValue: e.target.value })}
              leadingElement={<Icon src={Search} className="mt-2 icon" />}
              value={studentsData.inputValue}
              data-testid="studentInput"
            />
          </Form.Group>
        </Form.Row>
        <div className="col-12 px-1 d-flex align-items-baseline justify-content-center">
          <Form.Row className="col-12">
            <Form.Group as={Col}>
              <Select
                placeholder="Course"
                name="course_name"
                className="mr-2"
                options={courses}
                onChange={option => setStudentsData({ ...studentsData, course: option })}
                value={studentsData.course}
                isLoading={isCoursesLoading}
                isDisabled={isCoursesLoading}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Select
                placeholder="Class"
                name="class_name"
                className="mr-2"
                options={classes}
                onChange={option => setStudentsData({ ...studentsData, class: option })}
                value={studentsData.class}
                isLoading={isClassesLoading}
                isDisabled={isClassesLoading || !studentsData.course}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Select
                placeholder="Exam ready"
                name="exam_ready"
                options={examReadyOptions}
                onChange={option => setStudentsData({ ...studentsData, isExamReady: option })}
                value={studentsData.isExamReady}
              />
            </Form.Group>
          </Form.Row>
        </div>
        <div className="d-flex col-4 justify-content-end mr-2">
          <Button
            text
            variant="tertiary"
            className="mr-2"
            onClick={resetFilters}
            disabled={isButtonDisabled}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isButtonDisabled}
          >
            Apply
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default StudentsFilters;
