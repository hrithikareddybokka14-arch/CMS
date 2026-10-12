package com.college.cms.controller;

import com.college.cms.model.Attendance;
import com.college.cms.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @RequestParam String date,
            @RequestParam(required = false) String courseCode) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date, courseCode));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<Attendance> recordSingle(@Valid @RequestBody Attendance record) {
        return ResponseEntity.ok(attendanceService.recordAttendance(record));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<Attendance>> recordBatch(@RequestBody List<Attendance> records) {
        return ResponseEntity.ok(attendanceService.recordBatch(records));
    }
}
