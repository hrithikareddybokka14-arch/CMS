package com.college.cms.controller;

import com.college.cms.model.Mark;
import com.college.cms.service.MarkService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarkController {

    private final MarkService markService;

    public MarkController(MarkService markService) {
        this.markService = markService;
    }

    @GetMapping
    public ResponseEntity<List<Mark>> getMarks(
            @RequestParam(required = false) String courseCode,
            @RequestParam(required = false) String examType,
            @RequestParam(required = false) String studentId) {
        return ResponseEntity.ok(markService.getMarks(courseCode, examType, studentId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Mark>> getStudentMarks(@PathVariable String studentId) {
        return ResponseEntity.ok(markService.getMarksByStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<Mark> saveMark(@Valid @RequestBody Mark mark) {
        return ResponseEntity.ok(markService.saveMark(mark));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<Mark>> saveBatch(@RequestBody List<Mark> marks) {
        return ResponseEntity.ok(markService.saveBatch(marks));
    }
}
