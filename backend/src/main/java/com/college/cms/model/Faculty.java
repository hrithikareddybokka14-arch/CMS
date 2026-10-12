package com.college.cms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "faculty")
public class Faculty {
    @Id
    private String id;

    @NotBlank(message = "Employee ID is required")
    @Indexed(unique = true)
    private String employeeId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Designation is required")
    private String designation; // Professor, Associate Professor, Assistant Professor, Lecturer

    private String qualification; // Ph.D., M.Tech, M.S.
    private String joiningDate;
    private String status = "ACTIVE";

    public Faculty() {}

    public Faculty(String employeeId, String name, String email, String phone, 
                   String department, String designation, String qualification, String joiningDate, String status) {
        this.employeeId = employeeId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.qualification = qualification;
        this.joiningDate = joiningDate;
        this.status = status != null ? status : "ACTIVE";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getJoiningDate() { return joiningDate; }
    public void setJoiningDate(String joiningDate) { this.joiningDate = joiningDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
