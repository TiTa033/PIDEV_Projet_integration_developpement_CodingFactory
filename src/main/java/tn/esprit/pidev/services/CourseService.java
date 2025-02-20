package tn.esprit.pidev.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.pidev.entities.Certification;
import tn.esprit.pidev.entities.Course;
import tn.esprit.pidev.repository.CertificationRepository;
import tn.esprit.pidev.repository.CourseRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class CourseService implements ICourseService {
    CourseRepository courseRepository;
    //CertificationRepository certificationRepository;

    @Override
    public List<Course> retrieveAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Course retrieveCourse(Long courseId) {
        return courseRepository.findById(courseId).orElse(null);
    }

    @Override
    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public void removeCourse(Long courseId) {
        courseRepository.deleteById(courseId);
    }

    @Override
    public Course modifyCourse(Course course) {
        return courseRepository.save(course);
    }

    /*public void assignCertificationToCourse(Long courseId, Long certificationId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        Certification certification = certificationRepository.findById(certificationId).orElseThrow(() -> new RuntimeException("Certification not found"));

        course.getCertifications().add(certification);
        courseRepository.save(course);
    }*/
}
