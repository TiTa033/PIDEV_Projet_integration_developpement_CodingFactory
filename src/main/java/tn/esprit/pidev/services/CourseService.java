package tn.esprit.pidev.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.pidev.entities.Course;
import tn.esprit.pidev.repository.CourseRepository;
import java.util.List;

@Service
@AllArgsConstructor
public class CourseService implements ICourseService {
    CourseRepository courseRepository;

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

    public Course updateCourseTags(Long courseId, List<String> newTags) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setTags(newTags);
        return courseRepository.save(course);
    }

    @Override
    public Course rateCourse(Long courseId, int newRating) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Vérifier que la note est entre 1 et 5
        if (newRating < 1 || newRating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Calculer la nouvelle moyenne pondérée
        course.setRating((course.getRating() * course.getRatingCount() + newRating) / (course.getRatingCount() + 1));
        course.setRatingCount(course.getRatingCount() + 1);

        courseRepository.save(course); // Save the updated course

        return courseRepository.findById(courseId).orElseThrow(); // Return fresh course from DB
    }
}