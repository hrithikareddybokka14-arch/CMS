package com.college.cms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Document(collection = "courses")
public class Course {
    @Id
    private String id;

    @NotBlank(message = "Course code is required")
    @Indexed(unique = true)
    private String courseCode; // e.g. CS101

    @NotBlank(message = "Course name is required")
    private String courseName; // e.g. Data Structures and Algorithms

    @NotBlank(message = "Department is required")
    private String department; // Computer Science

    @Positive(message = "Credits must be positive")
    private int credits; // 3, 4

    private int semester; // 1, 2, 3, 4, 5, 6, 7, 8
    private String facultyName; // Dr. Jane Doe
    private String description;

    public Course() {}

    public Course(String courseCode, String courseName, String department, int credits, int semester, String facultyName, String description) {
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.department = department;
        this.credits = credits;
        this.semester = semester;
        this.facultyName = facultyName;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
