package com.college.cms.repository;

import com.college.cms.model.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends MongoRepository<Faculty, String> {
    Optional<Faculty> findByEmployeeId(String employeeId);
    List<Faculty> findByDepartment(String department);
    List<Faculty> findByNameContainingIgnoreCaseOrEmployeeIdContainingIgnoreCase(String name, String employeeId);
}
