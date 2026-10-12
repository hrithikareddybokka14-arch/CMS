package com.college.cms.service;

import com.college.cms.dto.DashboardStatsDto;
import com.college.cms.model.Student;
import com.college.cms.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final StudentService studentService;
    private final FacultyService facultyService;
    private final CourseService courseService;
    private final AttendanceService attendanceService;
    private final StudentRepository studentRepository;

    public DashboardService(StudentService studentService, FacultyService facultyService,
                            CourseService courseService, AttendanceService attendanceService,
                            StudentRepository studentRepository) {
        this.studentService = studentService;
        this.facultyService = facultyService;
        this.courseService = courseService;
        this.attendanceService = attendanceService;
        this.studentRepository = studentRepository;
    }

    public DashboardStatsDto getDashboardStatistics() {
        long totalStudents = studentService.count();
        long totalFaculty = facultyService.count();
        long totalCourses = courseService.count();
        double attendanceRate = attendanceService.getOverallAttendanceRate();

        String today = LocalDate.now().toString();
        long todayPresent = attendanceService.getTodayPresentCount(today);
        long todayAbsent = attendanceService.getTodayAbsentCount(today);

        // Department distribution
        List<Student> allStudents = studentRepository.findAll();
        Map<String, Long> departmentDistribution = new HashMap<>();
        for (Student s : allStudents) {
            String dept = s.getDepartment() != null ? s.getDepartment() : "General";
            departmentDistribution.put(dept, departmentDistribution.getOrDefault(dept, 0L) + 1);
        }

        // Recent 5 students
        List<Student> recentStudents = allStudents.stream()
                .limit(5)
                .collect(Collectors.toList());

        return new DashboardStatsDto(
                totalStudents,
                totalFaculty,
                totalCourses,
                attendanceRate,
                todayPresent,
                todayAbsent,
                departmentDistribution,
                recentStudents
        );
    }
}
