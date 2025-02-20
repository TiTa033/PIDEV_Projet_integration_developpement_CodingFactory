package tn.esprit.pidev.services;

import tn.esprit.pidev.entities.Course;

import java.util.List;

public interface ICourseService {
    List<Course> retrieveAllCourses();
    Course retrieveCourse(Long courseId);
    Course addCourse(Course course);
    void removeCourse(Long courseId);
    Course modifyCourse(Course course);
    //void assignCertificationToCourse(Long courseId, Long certificationId);
}
