package com.college.cms.controller;

import com.college.cms.model.Course;
import com.college.cms.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses(@RequestParam(required = false) String department) {
        return ResponseEntity.ok(courseService.getAllCourses(department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        Course created = courseService.createCourse(course);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @Valid @RequestBody Course course) {
        return ResponseEntity.ok(courseService.updateCourse(id, course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));
    }
}
