package tn.esprit.pidev.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pidev.entities.Course;
import tn.esprit.pidev.services.ICourseService;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/course")
public class CourseRestController {
    ICourseService courseService;

    @GetMapping("/retrieve-all-courses")
    public List<Course> getCourses() {
        return courseService.retrieveAllCourses();
    }

    @GetMapping("/retrieve-course/{course-id}")
    public Course retrieveCourse(@PathVariable("course-id") Long courseId) {
        return courseService.retrieveCourse(courseId);
    }

    @PostMapping("/add-course")
    public Course addCourse(@Valid @RequestBody Course course) {
        return courseService.addCourse(course);
    }

    @DeleteMapping("/remove-course/{course-id}")
    public void removeCourse(@PathVariable("course-id") Long courseId) {
        courseService.removeCourse(courseId);
    }

    @PutMapping("/modify-course")
    public Course modifyCourse(@Valid @RequestBody Course course) {
        return courseService.modifyCourse(course);
    }

    @PutMapping("/{courseId}/update-tags")
    public Course updateCourseTags(@PathVariable Long courseId, @RequestBody List<String> newTags) {
        return courseService.updateCourseTags(courseId, newTags);
    }

    @PutMapping("/rate-course/{course-id}/{rating}")
    public ResponseEntity<Course> rateCourse(@PathVariable("course-id") Long courseId, @PathVariable("rating") int rating) {
        return ResponseEntity.ok(courseService.rateCourse(courseId, rating));
    }
}