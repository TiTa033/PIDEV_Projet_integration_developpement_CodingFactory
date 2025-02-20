package tn.esprit.pidev.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.pidev.entities.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
}