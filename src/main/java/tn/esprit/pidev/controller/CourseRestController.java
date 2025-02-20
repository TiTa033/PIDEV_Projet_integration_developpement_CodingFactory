package tn.esprit.pidev.controller;


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
    public Course addCourse(@RequestBody Course course) {
        return courseService.addCourse(course);
    }

    @DeleteMapping("/remove-course/{course-id}")
    public void removeCourse(@PathVariable("course-id") Long courseId) {
        courseService.removeCourse(courseId);
    }

    @PutMapping("/modify-course")
    public Course modifyCourse(@RequestBody Course course) {
        return courseService.modifyCourse(course);
    }

    /*@PostMapping("/{courseId}/assign-certification/{certificationId}")
    public ResponseEntity<String> assignCertification(@PathVariable Long courseId, @PathVariable Long certificationId) {
        courseService.assignCertificationToCourse(courseId, certificationId);
        return ResponseEntity.ok("Certification assigned to course successfully");
    }*/
}