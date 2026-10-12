package com.college.cms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "attendance")
@CompoundIndex(name = "student_date_course_idx", def = "{'studentId': 1, 'date': 1, 'courseCode': 1}", unique = true)
public class Attendance {
    @Id
    private String id;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    private String studentName;

    @NotBlank(message = "Date is required")
    private String date; // YYYY-MM-DD

    private String courseCode;
    private String courseName;
    private String department;

    @NotBlank(message = "Status is required")
    private String status; // PRESENT, ABSENT, LATE

    private String remarks;

    public Attendance() {}

    public Attendance(String studentId, String studentName, String date, String courseCode, 
                      String courseName, String department, String status, String remarks) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.date = date;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.department = department;
        this.status = status;
        this.remarks = remarks;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
