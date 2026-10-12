package com.college.cms.repository;

import com.college.cms.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByStudentId(String studentId);
    List<Student> findByDepartment(String department);
    List<Student> findByYear(String year);
    List<Student> findByNameContainingIgnoreCaseOrStudentIdContainingIgnoreCase(String name, String studentId);
}
