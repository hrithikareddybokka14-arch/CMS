package com.college.cms.repository;

import com.college.cms.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByDate(String date);
    List<Attendance> findByDateAndCourseCode(String date, String courseCode);
    List<Attendance> findByStudentId(String studentId);
    Optional<Attendance> findByStudentIdAndDateAndCourseCode(String studentId, String date, String courseCode);
    long countByDateAndStatus(String date, String status);
    long countByStatus(String status);
}
