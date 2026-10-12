package com.college.cms.service;

import com.college.cms.exception.ResourceNotFoundException;
import com.college.cms.model.Student;
import com.college.cms.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents(String search, String department, String year) {
        List<Student> students = studentRepository.findAll();

        return students.stream()
                .filter(s -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String query = search.trim().toLowerCase();
                        boolean matchName = s.getName() != null && s.getName().toLowerCase().contains(query);
                        boolean matchId = s.getStudentId() != null && s.getStudentId().toLowerCase().contains(query);
                        boolean matchEmail = s.getEmail() != null && s.getEmail().toLowerCase().contains(query);
                        if (!matchName && !matchId && !matchEmail) return false;
                    }
                    if (department != null && !department.trim().isEmpty() && !department.equalsIgnoreCase("All")) {
                        if (s.getDepartment() == null || !s.getDepartment().equalsIgnoreCase(department.trim())) {
                            return false;
                        }
                    }
                    if (year != null && !year.trim().isEmpty() && !year.equalsIgnoreCase("All")) {
                        if (s.getYear() == null || !s.getYear().equalsIgnoreCase(year.trim())) {
                            return false;
                        }
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public Student getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with studentId: " + studentId));
    }

    public Student createStudent(Student student) {
        if (studentRepository.findByStudentId(student.getStudentId()).isPresent()) {
            throw new IllegalArgumentException("Student ID already exists: " + student.getStudentId());
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(String id, Student updatedData) {
        Student existing = getStudentById(id);

        // Check if studentId changed and conflicts
        if (!existing.getStudentId().equals(updatedData.getStudentId())) {
            studentRepository.findByStudentId(updatedData.getStudentId()).ifPresent(s -> {
                if (!s.getId().equals(id)) {
                    throw new IllegalArgumentException("Student ID already exists: " + updatedData.getStudentId());
                }
            });
        }

        existing.setStudentId(updatedData.getStudentId());
        existing.setName(updatedData.getName());
        existing.setEmail(updatedData.getEmail());
        existing.setPhone(updatedData.getPhone());
        existing.setDepartment(updatedData.getDepartment());
        existing.setCourse(updatedData.getCourse());
        existing.setYear(updatedData.getYear());
        existing.setSemester(updatedData.getSemester());
        existing.setDob(updatedData.getDob());
        existing.setGender(updatedData.getGender());
        existing.setAddress(updatedData.getAddress());
        existing.setStatus(updatedData.getStatus());

        return studentRepository.save(existing);
    }

    public void deleteStudent(String id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    public long count() {
        return studentRepository.count();
    }
}
