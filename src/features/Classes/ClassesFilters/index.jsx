import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Col, Form } from '@edx/paragon';
import { Select, Button } from 'react-paragon-topaz';

import { fetchAllCourses, fetchAllClassesData } from 'features/Common/data';
import { updateCurrentPage, updateFilters } from 'features/Classes/data/slice';
import { getClasses } from 'features/Classes/data';

import { RequestStatus, initialPage } from 'features/constants';

const ClassesFilters = () => {
  const dispatch = useDispatch();
  const instructorUserName = useSelector((state) => state.main.username);
  const institution = useSelector((state) => state.main.institution);
  const filters = useSelector((state) => state.classes.filters);
  const courses = useSelector((state) => state.common.allCourses);
  const classes = useSelector((state) => state.common.allClasses);

  const coursesOptions = courses.data
    .map((course) => ({ label: course.masterCourseName, value: course.masterCourseName }));
  const classesOptions = classes.data
    .map((classItem) => ({ label: classItem.className, value: classItem.classId }));

  const isCoursesLoading = courses.status === RequestStatus.LOADING;
  const isClassesLoading = classes.status === RequestStatus.LOADING;

  const [courseSelected, setCourseSelected] = useState(
    coursesOptions?.find((courseElement) => courseElement.value === filters?.course_name)
    || null,
  );
  const [classSelected, setClassSelected] = useState(
    classesOptions?.find((classElement) => classElement.value === filters?.class_id)
    || null,
  );

  const isButtonDisabled = courseSelected === null && classSelected === null;

  const initialRequestParams = {
    limit: true,
    page: initialPage,
    institution_id: institution?.id,
  };

  const handleSelectFilters = async (e) => {
    e.preventDefault();

    if (isButtonDisabled) { return; }

    const filtersParams = {
      class_id: classSelected?.value,
      course_name: courseSelected?.value,
      institution_id: institution?.id,
    };

    dispatch(updateFilters(filtersParams));
    dispatch(updateCurrentPage(initialPage));
    dispatch(getClasses(instructorUserName, { ...filtersParams, ...initialRequestParams }));
  };

  const handleCleanFilters = () => {
    dispatch(getClasses(instructorUserName, { institution_id: institution?.id, ...initialRequestParams }));
    setClassSelected(null);
    setCourseSelected(null);
    dispatch(updateFilters({}));
  };

  useEffect(() => {
    if (instructorUserName) {
      dispatch(fetchAllCourses(instructorUserName, { institution_id: institution?.id }));
      dispatch(fetchAllClassesData(instructorUserName, { institution_id: institution?.id }));
    }
  }, [dispatch, instructorUserName, institution]);

  return (
    <Form onSubmit={handleSelectFilters} className="w-100 px-4 d-flex flex-column align-items-center">
      <Form.Row className="px-0 d-flex flex-wrap w-100">
        <Form.Group as={Col} className="px-0 w-50">
          <Select
            placeholder="Course"
            name="course_name"
            className="mr-2 select"
            options={coursesOptions}
            onChange={option => setCourseSelected(option)}
            value={courseSelected}
            isLoading={isCoursesLoading}
            isDisabled={isCoursesLoading}
          />
        </Form.Group>
        <Form.Group as={Col} className="px-0 w-50">
          <Select
            placeholder="Class"
            name="class_id"
            options={classesOptions}
            onChange={option => setClassSelected(option)}
            value={classSelected}
            isLoading={isClassesLoading}
            isDisabled={isClassesLoading}
          />
        </Form.Group>
      </Form.Row>
      <Form.Group className="w-100 d-flex justify-content-end px-0">
        <Button
          onClick={handleCleanFilters}
          variant="tertiary"
          text
          className="mr-2"
          disabled={isButtonDisabled}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isButtonDisabled}>Apply</Button>
      </Form.Group>
    </Form>
  );
};

export default ClassesFilters;
