package com.college.cms.repository;

import com.college.cms.model.Mark;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarkRepository extends MongoRepository<Mark, String> {
    List<Mark> findByStudentId(String studentId);
    List<Mark> findByCourseCode(String courseCode);
    List<Mark> findByCourseCodeAndExamType(String courseCode, String examType);
    Optional<Mark> findByStudentIdAndCourseCodeAndExamType(String studentId, String courseCode, String examType);
}
