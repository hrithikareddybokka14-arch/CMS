package com.college.cms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "students")
public class Student {
    @Id
    private String id;

    @NotBlank(message = "Student ID is required")
    @Indexed(unique = true)
    private String studentId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Course is required")
    private String course;

    @NotBlank(message = "Year is required")
    private String year; // e.g., "1st Year", "2nd Year", "3rd Year", "4th Year"

    private int semester;
    private String dob;
    private String gender;
    private String address;
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, GRADUATED

    public Student() {}

    public Student(String studentId, String name, String email, String phone, String department, 
                   String course, String year, int semester, String dob, String gender, String address, String status) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.course = course;
        this.year = year;
        this.semester = semester;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.status = status != null ? status : "ACTIVE";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
