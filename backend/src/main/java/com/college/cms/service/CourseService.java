package com.college.cms.service;

import com.college.cms.exception.ResourceNotFoundException;
import com.college.cms.model.Course;
import com.college.cms.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses(String department) {
        List<Course> courses = courseRepository.findAll();

        if (department != null && !department.trim().isEmpty() && !department.equalsIgnoreCase("All")) {
            return courses.stream()
                    .filter(c -> c.getDepartment() != null && c.getDepartment().equalsIgnoreCase(department.trim()))
                    .collect(Collectors.toList());
        }
        return courses;
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    public Course getCourseByCode(String courseCode) {
        return courseRepository.findByCourseCode(courseCode)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with code: " + courseCode));
    }

    public Course createCourse(Course course) {
        if (courseRepository.findByCourseCode(course.getCourseCode()).isPresent()) {
            throw new IllegalArgumentException("Course code already exists: " + course.getCourseCode());
        }
        return courseRepository.save(course);
    }

    public Course updateCourse(String id, Course updatedData) {
        Course existing = getCourseById(id);

        if (!existing.getCourseCode().equals(updatedData.getCourseCode())) {
            courseRepository.findByCourseCode(updatedData.getCourseCode()).ifPresent(c -> {
                if (!c.getId().equals(id)) {
                    throw new IllegalArgumentException("Course code already exists: " + updatedData.getCourseCode());
                }
            });
        }

        existing.setCourseCode(updatedData.getCourseCode());
        existing.setCourseName(updatedData.getCourseName());
        existing.setDepartment(updatedData.getDepartment());
        existing.setCredits(updatedData.getCredits());
        existing.setSemester(updatedData.getSemester());
        existing.setFacultyName(updatedData.getFacultyName());
        existing.setDescription(updatedData.getDescription());

        return courseRepository.save(existing);
    }

    public void deleteCourse(String id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }

    public long count() {
        return courseRepository.count();
    }
}
