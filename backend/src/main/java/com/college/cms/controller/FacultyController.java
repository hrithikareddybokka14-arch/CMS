package com.college.cms.controller;

import com.college.cms.model.Faculty;
import com.college.cms.service.FacultyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculty(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department) {
        return ResponseEntity.ok(facultyService.getAllFaculty(search, department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getFacultyById(@PathVariable String id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @PostMapping
    public ResponseEntity<Faculty> createFaculty(@Valid @RequestBody Faculty faculty) {
        Faculty created = facultyService.createFaculty(faculty);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faculty> updateFaculty(@PathVariable String id, @Valid @RequestBody Faculty faculty) {
        return ResponseEntity.ok(facultyService.updateFaculty(id, faculty));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFaculty(@PathVariable String id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.ok(Map.of("message", "Faculty deleted successfully"));
    }
}
