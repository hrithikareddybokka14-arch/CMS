package com.college.cms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Document(collection = "marks")
@CompoundIndex(name = "student_course_exam_idx", def = "{'studentId': 1, 'courseCode': 1, 'examType': 1}", unique = true)
public class Mark {
    @Id
    private String id;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    private String studentName;

    @NotBlank(message = "Course code is required")
    private String courseCode;

    private String courseName;

    @NotBlank(message = "Exam type is required")
    private String examType; // "Midterm Exam", "Final Exam", "Assignment 1", "Quiz 1"

    @PositiveOrZero(message = "Max marks must be non-negative")
    private double maxMarks = 100.0;

    @PositiveOrZero(message = "Marks obtained must be non-negative")
    private double marksObtained;

    private String grade; // A+, A, B+, B, C, D, F
    private int semester;
    private String academicYear = "2024-2025";
    private String remarks;

    public Mark() {}

    public Mark(String studentId, String studentName, String courseCode, String courseName, 
                String examType, double maxMarks, double marksObtained, String grade, 
                int semester, String academicYear, String remarks) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.examType = examType;
        this.maxMarks = maxMarks;
        this.marksObtained = marksObtained;
        this.grade = grade != null ? grade : calculateGrade(marksObtained, maxMarks);
        this.semester = semester;
        this.academicYear = academicYear;
        this.remarks = remarks;
    }

    public static String calculateGrade(double obtained, double max) {
        if (max <= 0) return "N/A";
        double percentage = (obtained / max) * 100.0;
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 40) return "D";
        return "F";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(double maxMarks) { this.maxMarks = maxMarks; }

    public double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(double marksObtained) { 
        this.marksObtained = marksObtained; 
        this.grade = calculateGrade(marksObtained, this.maxMarks);
    }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
