package com.college.cms.controller;

import com.college.cms.model.Student;
import com.college.cms.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String year) {
        return ResponseEntity.ok(studentService.getAllStudents(search, department, year));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable String id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/by-student-id/{studentId}")
    public ResponseEntity<Student> getStudentByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.getStudentByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student created = studentService.createStudent(student);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable String id, @Valid @RequestBody Student student) {
        return ResponseEntity.ok(studentService.updateStudent(id, student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable String id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }
}
