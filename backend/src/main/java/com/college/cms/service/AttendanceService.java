package com.college.cms.service;

import com.college.cms.exception.ResourceNotFoundException;
import com.college.cms.model.Attendance;
import com.college.cms.model.Student;
import com.college.cms.repository.AttendanceRepository;
import com.college.cms.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public List<Attendance> getAttendanceByDate(String date, String courseCode) {
        if (courseCode != null && !courseCode.trim().isEmpty() && !courseCode.equalsIgnoreCase("All")) {
            return attendanceRepository.findByDateAndCourseCode(date, courseCode);
        }
        return attendanceRepository.findByDate(date);
    }

    public List<Attendance> getAttendanceByStudent(String studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public Attendance recordAttendance(Attendance record) {
        // Verify student refers to a valid student record
        Optional<Student> studentOpt = studentRepository.findByStudentId(record.getStudentId());
        if (studentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Cannot record attendance: Student not found with student ID: " + record.getStudentId());
        }

        // Enrich student name if not provided
        if (record.getStudentName() == null || record.getStudentName().isEmpty()) {
            record.setStudentName(studentOpt.get().getName());
        }

        // Check if existing record for this student on date & courseCode
        Optional<Attendance> existing = attendanceRepository.findByStudentIdAndDateAndCourseCode(
                record.getStudentId(), record.getDate(), record.getCourseCode());

        if (existing.isPresent()) {
            Attendance toUpdate = existing.get();
            toUpdate.setStatus(record.getStatus());
            toUpdate.setRemarks(record.getRemarks());
            return attendanceRepository.save(toUpdate);
        }

        return attendanceRepository.save(record);
    }

    public List<Attendance> recordBatch(List<Attendance> records) {
        List<Attendance> saved = new ArrayList<>();
        for (Attendance record : records) {
            saved.add(recordAttendance(record));
        }
        return saved;
    }

    public double getOverallAttendanceRate() {
        long totalPresent = attendanceRepository.countByStatus("PRESENT");
        long totalAbsent = attendanceRepository.countByStatus("ABSENT");
        long totalLate = attendanceRepository.countByStatus("LATE");
        long total = totalPresent + totalAbsent + totalLate;

        if (total == 0) return 0.0;
        return Math.round(((double) totalPresent / total) * 1000.0) / 10.0;
    }

    public long getTodayPresentCount(String date) {
        return attendanceRepository.countByDateAndStatus(date, "PRESENT");
    }

    public long getTodayAbsentCount(String date) {
        return attendanceRepository.countByDateAndStatus(date, "ABSENT");
    }
}
