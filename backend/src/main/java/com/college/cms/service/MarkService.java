package com.college.cms.service;

import com.college.cms.exception.ResourceNotFoundException;
import com.college.cms.model.Mark;
import com.college.cms.model.Student;
import com.college.cms.repository.MarkRepository;
import com.college.cms.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MarkService {

    private final MarkRepository markRepository;
    private final StudentRepository studentRepository;

    public MarkService(MarkRepository markRepository, StudentRepository studentRepository) {
        this.markRepository = markRepository;
        this.studentRepository = studentRepository;
    }

    public List<Mark> getMarks(String courseCode, String examType, String studentId) {
        if (studentId != null && !studentId.trim().isEmpty()) {
            return markRepository.findByStudentId(studentId.trim());
        }
        if (courseCode != null && !courseCode.trim().isEmpty()) {
            if (examType != null && !examType.trim().isEmpty() && !examType.equalsIgnoreCase("All")) {
                return markRepository.findByCourseCodeAndExamType(courseCode.trim(), examType.trim());
            }
            return markRepository.findByCourseCode(courseCode.trim());
        }
        return markRepository.findAll();
    }

    public List<Mark> getMarksByStudent(String studentId) {
        return markRepository.findByStudentId(studentId);
    }

    public Mark saveMark(Mark mark) {
        // Verify student refers to a valid student record
        Optional<Student> studentOpt = studentRepository.findByStudentId(mark.getStudentId());
        if (studentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Cannot enter marks: Student not found with student ID: " + mark.getStudentId());
        }

        if (mark.getStudentName() == null || mark.getStudentName().isEmpty()) {
            mark.setStudentName(studentOpt.get().getName());
        }

        // Auto calculate grade
        mark.setGrade(Mark.calculateGrade(mark.getMarksObtained(), mark.getMaxMarks()));

        Optional<Mark> existing = markRepository.findByStudentIdAndCourseCodeAndExamType(
                mark.getStudentId(), mark.getCourseCode(), mark.getExamType());

        if (existing.isPresent()) {
            Mark toUpdate = existing.get();
            toUpdate.setMaxMarks(mark.getMaxMarks());
            toUpdate.setMarksObtained(mark.getMarksObtained());
            toUpdate.setGrade(mark.getGrade());
            toUpdate.setSemester(mark.getSemester());
            toUpdate.setAcademicYear(mark.getAcademicYear());
            toUpdate.setRemarks(mark.getRemarks());
            return markRepository.save(toUpdate);
        }

        return markRepository.save(mark);
    }

    public List<Mark> saveBatch(List<Mark> marks) {
        List<Mark> result = new ArrayList<>();
        for (Mark m : marks) {
            result.add(saveMark(m));
        }
        return result;
    }
}
